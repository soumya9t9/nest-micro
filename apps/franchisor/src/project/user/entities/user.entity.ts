import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    mobile: number;
    
    @Column()
    email: string;
    
    @Column()
    loginId: string;
    
    @Column()
    @Exclude({toPlainOnly: true})
    password: string;
    
    @Column()
    firstName:string;
    
    @Column()
    middleName:string;
    
    @Column()
    lastName:string;

    @CreateDateColumn()
    createdOn: Date

    @UpdateDateColumn()
    updatedOn: Date
}
