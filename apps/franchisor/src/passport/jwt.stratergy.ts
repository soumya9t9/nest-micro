import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from '../configs/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(@Inject(appConfig.KEY) private configService: ConfigType<typeof appConfig>) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.jwtSecret
		});
	}

	async validate(payload: any) {
		return { userId: payload.sub, username: payload.username };
	}
}
