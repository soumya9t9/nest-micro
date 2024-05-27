import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { IUserRepository } from "./interfaces/user-repository.interface";
import { BaseAbstractRepostitory } from "@app/common";


export class UserRepository extends BaseAbstractRepostitory<User> implements IUserRepository {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
        super(userRepository)
    }
}