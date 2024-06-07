import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';
import { GlobalConst } from '../../global.const';
import { Observable, from, map, mergeMap, of } from 'rxjs';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}
	create(createUserDto: CreateUserDto): Observable<any>{
		try {
			return from(genSalt(GlobalConst.saltRound)).pipe(
				mergeMap((salt) => from(hash(createUserDto.password, salt))),
				mergeMap((hashedPsw) => {
				return from(this.userRepository.insert({ ...createUserDto, password: hashedPsw }));
			}));

		} catch (e) {
			return of(new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR))
		}
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
