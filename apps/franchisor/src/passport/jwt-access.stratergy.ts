import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from '../configs/app.config';
import { IJWT } from '../modules/auth/jwt.interfae';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(@Inject(appConfig.KEY) private configService: ConfigType<typeof appConfig>) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.jwtSecret
		});
	}

	async validate(payload: any|IJWT) {
		return {...payload, userId: payload.sub};
	}
}
