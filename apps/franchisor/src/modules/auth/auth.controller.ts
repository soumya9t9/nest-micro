import { Body, Controller, Get, Headers, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ISignIn } from './signin.interface';
import { Public } from './public-stratergy';
import appConfig from '../../configs/app.config';
import { ConfigType } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Public()
@ApiTags('authentication')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		@Inject(appConfig.KEY) private configService: ConfigType<typeof appConfig>
	) {}

	@Post('/local')
	localLogIn(@Res() res, @Body() body: ISignIn) {
		if (body.email) return this.authService.signInByEmail(body.email, body.cred).then(user => {
			res.json(user)
		});
		else return this.authService.signInByProfileId(body.profileId, body.cred).then(user => {
			res.json(user)
		});;
	}

	@UseGuards(AuthGuard('google'))
	@Get('/google')
	oAuthLoginGoogle() {}

	@UseGuards(AuthGuard('google'))
	@Get('/google/callback')
	oAuthCallbackGoogle(@Req() req) {
		return this.authService.googleLogin(req);
	}

	@Post('/opt/email')
	otpViaEmail() {}

	@Get('env')
	getEnvs(@Res() res) {
		res.json(this.configService);
	}

	@Post('access-token')
	getAccessTokenByRefreshToken(@Res() res: Response, @Headers('Authorization') auth: string) {
		return this.authService.refreshTokens(parseInt(res.get('userId')), auth);
	}
}
