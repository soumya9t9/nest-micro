import { BaseEntity } from "@app/common/interfaces/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity('user_auth')
export class UserAuthEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id:number;

    // @ManyToOne(type => User, (rcv) => rcv.id)
    // @JoinColumn({ name: 'id' })
    @Column({name: "user_id"})
    userId:number;

    @Column({name:'session_id', type: 'varchar'})
    sessionId: string;

    @Column({name: 'refresh_token', unique: true, type: "varchar", length: 300})
    refreshToken: string;

    @Column({name: 'access_token', unique: true})
    accessToken: string;

}
