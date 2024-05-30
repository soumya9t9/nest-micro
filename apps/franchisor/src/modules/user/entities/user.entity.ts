import { BaseEntity } from "@app/common/interfaces/base.entity";
import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique: true})
    mobile: number;
    
    @Column({unique: true})
    email: string;
    
    @Column()
    loginId: number;

    @Column()
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

}
