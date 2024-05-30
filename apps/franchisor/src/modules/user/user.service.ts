import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private readonly userRepository: UserRepository) {}
	create(createUserDto: CreateUserDto) {
		return this.userRepository.create(createUserDto);
	}

	findAll() {
		return this.userRepository.findAll();
	}

	findOneByProfileId(profileId: string) {
		return this.userRepository.findOneById(profileId);
	}

  findOneByEmail(email: string) {
		return this.userRepository.findOne({where: {email}});
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return this.userRepository.save(updateUserDto);
	}

	remove(id: number) {
		return this.userRepository.delete({ loginId: id });
	}
}
