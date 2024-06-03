import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto  {
    firstName:string;
    middleName:string;
    lastName:string;

    @IsOptional()
    mobile?: bigint;
    email: string;
    profileId: string;
        
    @IsOptional()
    password?: string;
}
