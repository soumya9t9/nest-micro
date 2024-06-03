import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';
import { GlobalConst } from '../../global.const';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}
	async create(createUserDto: CreateUserDto) {
		genSalt(GlobalConst.saltRound).then((salt) => hash(createUserDto.password, salt)).then((hashedPsw) => {
			return this.userRepository.insert({ ...createUserDto, password: hashedPsw });
		});
	}

	findAll() {
		return this.userRepository.find();
	}

	findOneByProfileId(profileId: string) {
		// return this.userRepository.findOneBy({profileId});
		return this.userRepository.findOneById(profileId);
	}

	findOneByEmail(email: string) {
		return this.userRepository.findOneBy({ email });
	}

	update(profileId: string, updateUserDto: UpdateUserDto) {
		return this.userRepository.update({ profileId }, updateUserDto);
	}

	remove(profileId: string) {
		return this.userRepository.delete({ profileId });
	}
}
