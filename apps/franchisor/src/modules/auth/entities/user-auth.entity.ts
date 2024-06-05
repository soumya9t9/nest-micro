import { BaseEntity } from "@app/common/interfaces/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity('user-auth')
export class UserAuthEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @OneToMany(type => User, (rcv) => rcv.id)
    // @JoinColumn({ name: 'id' })
    userId:number;

    @Column('session_id')
    sessionId: string;

    @Column({name: 'refresh_token', unique: true})
    refreshToken: string;

    @Column({name: 'access_token', unique: true})
    accessToken: string;

}