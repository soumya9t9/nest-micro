import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from '../../passport/jwt-access.stratergy';
import { JwtRefreshStrategy } from '../../passport/jwt-refresh.stratergy';
import { GoogleStrategy } from '../../passport/google.stratergy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserAuthEntity } from './entities/user-auth.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserAuthService } from './user-auth.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([ User, UserAuthEntity ]),
		UserModule,
		JwtModule.register({
			global: true,
			secret: 'secret'
		}),
		PassportModule.register({ defaultStrategy: 'jwt' })
	],
	controllers: [ AuthController ],
	providers: [
		AuthService,
		JwtAccessStrategy,
		GoogleStrategy,
		JwtRefreshStrategy,
		UserAuthService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard
		},
	],
	exports: [ PassportModule, JwtModule, AuthService ]
})
export class AuthModule {}
