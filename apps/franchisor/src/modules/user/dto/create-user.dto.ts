import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto  {
    @ApiProperty()
    firstName:string;

    @ApiProperty()
    middleName:string;
    @ApiProperty()
    lastName:string;

    @IsOptional()
    @ApiPropertyOptional()
    mobile?: bigint;

    @ApiProperty()
    email: string;
    
    @ApiProperty()
    profileId: string;
        
    @IsOptional()
    password?: string;
}
