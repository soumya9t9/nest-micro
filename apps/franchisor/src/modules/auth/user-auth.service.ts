import { InjectRepository } from "@nestjs/typeorm";
import { UserAuthEntity } from "./entities/user-auth.entity";
import { Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import appConfig from "../../configs/app.config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class UserAuthService {

    jwtOptions: JwtSignOptions;
    constructor(
        @Inject(appConfig.KEY) private configService: ConfigType<typeof appConfig>,
        @InjectRepository(UserAuthEntity) private readonly userAuthRepo: Repository<UserAuthEntity>,
        private jwtService: JwtService
    ) {
        this.jwtOptions = {
			secret: configService.jwtSecret,
			algorithm: 'HS256'
		};
    }

    async validateToken(token: string, sessionId) {
		const userAuthData:UserAuthEntity = await this.userAuthRepo.findOneBy({sessionId})
        if(!userAuthData) return false;
		return this.jwtService.verify(token, {
            secret : this.configService.jwtSecret
        });
    }

}