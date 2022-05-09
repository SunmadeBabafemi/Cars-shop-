import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Report } from "./report.entity";


@Entity()
export class User {
   @PrimaryGeneratedColumn('uuid')
   id: string
   
   @Column({unique: true})
   email: string
   
   @Column()
   password: string

   @Column({default: true})
   admin: boolean

   @OneToMany(() => Report, (report) => report.user)
   reports?: Report[]

   @AfterInsert()
   logInsert() {
      console.log('Inserted User with id', this.id)
   }

   @AfterUpdate()
   logUpdate(){
      console.log('Updated user with email', this.email)
   }

   @AfterRemove()
   logRemove(){
      console.log('Successfully removed user with id', this.id)
   }
}