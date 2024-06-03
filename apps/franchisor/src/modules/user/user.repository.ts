import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DeleteResult, FindOptionsWhere, Repository } from "typeorm";
import { IUserRepository } from "./interfaces/user-repository.interface";
import { BaseAbstractRepostitory } from "@app/common";
import { Injectable } from "@nestjs/common";

@Injectable()
// export class UserRepository extends BaseAbstractRepostitory<User> implements IUserRepository {
//     constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
//         super(userRepository)
//     }

//     public async delete(data: Pick<User, 'profileId'>): Promise<DeleteResult> {
//         return await this.userRepository.delete({profileId: data.profileId})
//     }

//     public async findOneById(id: any): Promise<User> {
//         const options: FindOptionsWhere<User> = {
//             profileId: id
//         }
//         return await this.userRepository.findOneBy(options)
//     }

// }

export class UserRepository extends Repository<User> {
    this: Repository<User>;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {
        super(
          userRepository.target,
          userRepository.manager,
          userRepository.queryRunner,
        );
      }

    public async delete(data: Pick<User, 'profileId'>): Promise<DeleteResult> {
        return await this.delete({profileId: data.profileId})
    }

    public async findOneById(id: any): Promise<User> {
        const options: FindOptionsWhere<User> = {
            profileId: id
        }
        return await this.findOneBy(options)
    }

}