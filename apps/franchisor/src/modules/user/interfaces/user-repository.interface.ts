import { IBaseRepository } from "@app/common";
import { User } from "../entities/user.entity";

export interface IUserRepository extends IBaseRepository<User> {}
