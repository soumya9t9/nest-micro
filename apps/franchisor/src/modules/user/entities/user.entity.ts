import { BaseEntity } from "@app/common/interfaces/base.entity";
import { ApiResponseProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User extends BaseEntity {

    @ApiResponseProperty()
    @PrimaryGeneratedColumn()
    id:number;

    @ApiResponseProperty()
    @Column({unique: true, type: 'bigint'})
    mobile: bigint;
    

    @ApiResponseProperty()
    @Column({unique: true})
    email: string;

    @ApiResponseProperty()
    @Column({name: "profile_id",unique: true})
    profileId: string;
    
    @ApiResponseProperty()
    @Column({name: "first_name"})
    firstName:string;
    
    @ApiResponseProperty()
    @Column({name: "middle_name"})
    middleName:string;
    
    @ApiResponseProperty()
    @Column({name:"last_name"})
    lastName:string;
    
    @Column()
    @Exclude({toPlainOnly: true})
    password: string;  

    @Exclude({toPlainOnly: true})
    @Column()
    provider: string
}

export enum ProviderEnum {
    SELF = 'self',
    GOOGLE = 'google'
}