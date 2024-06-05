import { ForbiddenException, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import appConfig from '../../configs/app.config';
import { ProviderEnum, User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserAuthEntity } from './entities/user-auth.entity';

@Injectable()
export class AuthService {
	jwtOptions: JwtSignOptions;

	constructor(
		@InjectRepository(UserAuthEntity) private readonly userAuthRepo: Repository<UserAuthEntity>,
		@Inject(appConfig.KEY) private configService: ConfigType<typeof appConfig>,
		private usersService: UserService,
		private jwtService: JwtService
	) {
		this.jwtOptions = {
			secret: configService.jwtSecret,
			algorithm: 'HS256'
		};
	}

	async signInLocal(user: User, credentials) {
		let result = await compare(credentials, user.password);
		if (!result) {
			throw new UnauthorizedException();
		}
		return this.getUserDetailsAndToken(user, {});
	}
	
	async getUserDetailsAndToken(user: User, extraInfo:any) {
		let sessionId = crypto.randomUUID()
		return {
			userId: user.id,
			userName: user.profileId,
			sessionId,
			...(await this.getTokens(user, {...extraInfo, sessionId}))
		}
	}

	async getTokens(user: User, extraInfo:any) {
		const payload = { 
			sub: user.id, 
			email: user.email, 
			userName: user.profileId, 
			scope:[], 
			provider:user.provider, 
		};
		return {
			access_token: await this.jwtService.signAsync({ ...payload, type: 'access_token' }, { ...this.jwtOptions, expiresIn: '1m' }),
			refresh_token: await this.jwtService.signAsync({ ...payload, type: 'refresh_token' }, { ...this.jwtOptions, expiresIn: '12h' })
		};
	}

	async signInByEmail(email, credentials) {
		const user = await this.usersService.findOneByEmail(email);
		if(!user) return new HttpException(`User name or password didn't match`, HttpStatus.UNAUTHORIZED);
		if(user.provider != ProviderEnum.SELF) return new HttpException(`You might have signed up using any social app`, HttpStatus.UNAUTHORIZED);
		return this.signInLocal(user, credentials);
	}

	async signInByProfileId(accessId, credentials) {
		const user = await this.usersService.findOneByProfileId(accessId);
		if(!user) return new HttpException(`User name or password didn't match`, HttpStatus.UNAUTHORIZED);
		if(user.provider != ProviderEnum.SELF) return new HttpException(`You might have signed up using any social app`, HttpStatus.UNAUTHORIZED);
		return this.signInLocal(user, credentials);
	}

	async googleLogin(req) {
		const oAuthUser:OAuthGoogleUser = req.user;
		
		if (!oAuthUser) {
			return 'No user from google'
		}

		const existingUser = await this.usersService.findOneByEmail(oAuthUser.email);
		let newUser;
		if(!existingUser) {
			let {fn:firstName, mn:middleName, ln :lastName} = getFirstMiddleAndLastName(oAuthUser.name);
			await this.usersService.create({email: oAuthUser.email, firstName, middleName, lastName, profileId:`${firstName}${new Date().getTime()}`});
			newUser = await this.usersService.findOneByEmail(oAuthUser.email);
		} 
		
		return !!newUser ? this.getUserDetailsAndToken(newUser, {}) : this.getUserDetailsAndToken(existingUser, {});
	}

	async refreshTokens(userId: number, accessToken: string, ) {
		const user = await this.userAuthRepo.findOne({where: {userId}});
		if (!user || !user.accessToken)
		  throw new ForbiddenException('Access Denied');
		const refreshTokenMatches = await argon.verify(
		  user.accessToken,
		  accessToken,
		);
		if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
		const tokens = await this.getTokens(user.id, user.username);
		await this.updateRefreshToken(user.id, tokens.refreshToken);
		return tokens;
	  }

	  updateRefreshToken() {

	  }
}

function getFirstMiddleAndLastName(name): {fn:string, mn:string, ln:string} {
	name = name.trim();
	let nameComponends = name.split(" ");
	let lastName = nameComponends.splice(nameComponends.length - 1);
	return {
		fn:nameComponends.splice(0,1)[0], 
		mn:nameComponends.join(" "), 
		ln:lastName[0]
	};
}


export interface OAuthGoogleUser {
	email: string;
	name: string;
	picture: string;
	provider: 'google'
	providerId: string | number;
}