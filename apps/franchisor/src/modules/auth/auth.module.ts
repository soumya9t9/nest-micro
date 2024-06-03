import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from '../../passport/jwt-access.stratergy';
import { JwtRefreshStrategy } from '../../passport/jwt-refresh.stratergy';
import { GoogleStrategy } from '../../passport/google.stratergy';

@Module({
	imports: [
		UserModule,
		JwtModule.register({
			secret: 'secret'
		}),
		PassportModule.register({ defaultStrategy: 'jwt' })
	],
	controllers: [ AuthController ],
	providers: [ AuthService, JwtRefreshStrategy, GoogleStrategy, JwtAccessStrategy ],
	exports: [ PassportModule, JwtModule ]
})
export class AuthModule {}
