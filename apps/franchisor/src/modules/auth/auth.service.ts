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
			verify: { algorithms: [ 'HS256' ] }
		};
	}

	async signIn(user: User, credentials) {
		let result = await compare(credentials, user.password);
		if (!result) {
			throw new UnauthorizedException();
		}
		const payload = { sub: user.profileId, email: user.email, userId: user.id };
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
}
