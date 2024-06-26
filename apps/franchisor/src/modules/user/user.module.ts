import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule, getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { DataSource } from 'typeorm';
import { UserAuthEntity } from '../auth/entities/user-auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAuthEntity])
  ],
  controllers: [UserController],
  providers: [
    UserService, 
    // {
    //   provide: getRepositoryToken(User),
    //   // inject: [ getDataSourceToken()],
    //   useClass: UserRepository
    //   // useFactory(datasource: DataSource) {
    //   //   return datasource.getRepository(User).extend(UserRepository);
    //   // },
    // },
    UserRepository
  ],
  exports:[UserService, TypeOrmModule]
})
export class UserModule {}
