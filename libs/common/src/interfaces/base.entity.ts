import { CreateDateColumn, UpdateDateColumn } from "typeorm"

export class BaseEntity {
    
    @CreateDateColumn()
    createdOn: Date

    @UpdateDateColumn()
    updatedOn: Date
}