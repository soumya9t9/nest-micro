import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { User } from '../modules/user/entities/user.entity';
import { EnvironmentVariables, IEnvironmentVariables } from '../configs/env.config.interface';
import appConfig from '../configs/app.config';
import { UserRepository } from '../modules/user/user.repository';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    // @Inject() private configService: ConfigService<IEnvironmentVariables>,

    @Inject(appConfig.KEY) private configService: ConfigType<typeof appConfig>,
    // @InjectRepository(User) private userRepository: UserRepository,
  ) {
    super({
      clientID: configService.google.clientID,
      clientSecret: configService.google.clientSecret,
      callbackURL: "http://localhost:3001/auth/google/callback",
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    };

    done(null, user);
  }
}