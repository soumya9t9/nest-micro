import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import appConfig from '../../configs/app.config';
import { ConfigType } from '@nestjs/config';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
	jwtOptions;

	constructor(
		@Inject(appConfig.KEY) private configService: ConfigType<typeof appConfig>,
		private usersService: UserService,
		private jwtService: JwtService
	) {
		this.jwtOptions = {
			secret: configService.jwtSecret,
			verify: { algorithms: ['HS256'] }
		};
	}

	async signIn(user: User, credentials) {
		let result = await compare(credentials, user.password);
		if (!result) {
			throw new UnauthorizedException();
		}
		const payload = { sub: user.profileId, email: user.email, userId: user.id };
		return this.getTokens(payload);
	}

	async getTokens(payload) {
		return {
			access_token: await this.jwtService.signAsync({ ...payload, type: 'access_token' }, { ...this.jwtOptions, expiresIn: '1m' }),
			refresh_token: await this.jwtService.signAsync({ ...payload, type: 'refresh_token' }, { ...this.jwtOptions, expiresIn: '12h' })
		};
	}

	async signInByEmail(email, credentials) {
		const user = await this.usersService.findOneByEmail(email);
		return this.signIn(user, credentials);
	}

	async signInbyProfileId(accessId, credentials) {
		const user = await this.usersService.findOneByProfileId(accessId);
		return this.signIn(user, credentials);
	}

	googleLogin(req) {
		const oAuthUser:OAuthGoogleUser = req.user;
		
		if (!oAuthUser) {
			return 'No user from google'
		}

		const existingUser = this.usersService.findOneByEmail(oAuthUser.email);

		if(!existingUser) {
			let {fn:firstName, mn:middleName, ln :lastName} = getFirstMiddleAndLastName(oAuthUser.name);
			this.usersService.create({email: oAuthUser.email, firstName, middleName, lastName, profileId:"firstName"})
		}
		return {
			message: 'User information from google',
			user: req.user
		}
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