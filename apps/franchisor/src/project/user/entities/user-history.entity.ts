import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Exclude } from "class-transformer";

@Entity()
export class UserHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => User, (rcv) => rcv.id)
    // @JoinColumn({ name: 'id' })
    userId:number;

    @Column()
    @Exclude({toPlainOnly: true})
    password: string;

    @UpdateDateColumn()
    updatedOn: Date;
}