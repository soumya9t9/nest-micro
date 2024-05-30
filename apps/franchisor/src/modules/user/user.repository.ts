import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DeleteResult, FindOptionsWhere, Repository } from "typeorm";
import { IUserRepository } from "./interfaces/user-repository.interface";
import { BaseAbstractRepostitory } from "@app/common";


export class UserRepository extends BaseAbstractRepostitory<User> implements IUserRepository {
     private entity1: Repository<User>
    // protected constructor(entity: Repository<T>) {
    // }
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
        super(userRepository)
        this.entity1 = userRepository
    }

    public async delete(data: Pick<User, 'loginId'>): Promise<DeleteResult> {
        return await this.entity1.delete({loginId: data.loginId})
    }

    public async findOneById(id: any): Promise<User> {
        const options: FindOptionsWhere<User> = {
            profileId: id
        }
        return await this.entity1.findOneBy(options)
    }

}