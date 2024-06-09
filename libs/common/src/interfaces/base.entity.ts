import { CreateDateColumn, UpdateDateColumn } from "typeorm"

export class BaseEntity {
    
    @CreateDateColumn({name:"created_on"})
    createdOn: Date

    @UpdateDateColumn({name: "updated_on"})
    updatedOn: Date
}