import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {

    constructor(private usersService: UserService, private jwtService: JwtService) { }

    async signIn(user, credntial) {
        if (user?.password !== credntial) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    
    async signInByEmail(email, credntial) {
        const user = await this.usersService.findOneByEmail(email);
        return this.signIn(user, credntial)
    }
    
    async signInbyProfileId(accessId, credntial) {
        const user = await this.usersService.findOneByProfileId(accessId);
        return this.signIn(user, credntial);
    }
}
