import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ISignIn } from './signin.interface';
import { Public } from './public-stratergy';
import appConfig from '../../configs/app.config';
import { ConfigType } from '@nestjs/config';

@Public()
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService,
    @Inject(appConfig.KEY) private configService: ConfigType<typeof appConfig>

  ) {}

	@Post('/local')
	localLogIn(@Res() res, @Body() body: ISignIn) {
		if (body.email) return this.authService.signInByEmail(body.email, body.cred);
		else return this.authService.signInbyProfileId(body.profileId, body.cred);
	}

  @Post('/google')
  oAuthLoginGoogle() {

  }

  @Post('/google/callback')
  oAuthCallbackGoogle() {

  }

  @Post('/opt/email')
  otpViaEmail() {

  }

  @Get('env')
	getEnvs(@Res() res) {
		res.json(this.configService);
	}
}
