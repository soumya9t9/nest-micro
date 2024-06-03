import { IsNotEmpty } from 'class-validator';

export class CreateUserDto  {
    firstName:string;
    middleName:string;
    lastName:string;

    mobile: bigint;
    email: string;
    profileId: string;
        
    @IsNotEmpty()
    password: string;
}
