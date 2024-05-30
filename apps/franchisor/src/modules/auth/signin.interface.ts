import { IsEmail, IsNotEmpty } from "class-validator";

export class ISignIn {

    profileId: string;
    
    @IsEmail()
    email: string;

    @IsNotEmpty()
    cred:string;
}



