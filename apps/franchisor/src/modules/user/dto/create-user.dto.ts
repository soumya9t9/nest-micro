import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto  {
    firstName:string;
    middleName:string;
    lastName:string;

    mobile: number;
    email: string;
    profileId: string;
    loginId: number;
    
    @IsNotEmpty()
    password: string;
}
