import { BaseEntity } from "@app/common/interfaces/base.entity";
import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique: true, type: 'bigint'})
    mobile: bigint;
    
    @Column({unique: true})
    email: string;

    @Column({unique: true})
    profileId: string;
    
    @Column()
    firstName:string;
    
    @Column()
    middleName:string;
    
    @Column()
    lastName:string;
    
    @Column()
    @Exclude({toPlainOnly: true})
    password: string;  

    @Column()
    provider: string
}

export enum ProviderEnum {
    SELF = 'self',
    GOOGLE = 'google'
}