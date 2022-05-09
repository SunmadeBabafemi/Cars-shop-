import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
         private usersrepo: Repository<User>
    ){}


    create(email: string, password: string) {
        const user = this.usersrepo.create({email, password})
        return this.usersrepo.save(user)
    }

    findOne(id: string) {
        if(!id) {
            return null
        }
       const user = this.usersrepo.findOne(id) 
       return user
    }

    queryFind(email: string) {
        return this.usersrepo.find({ email })
    }

     async findByEmail(email: string){
        return await  this.usersrepo.find({where:{email: email}})
    }

    async findAll(): Promise<User[]> {
        return await this.usersrepo.find()
    }

    async update(id: string, attrs: Partial<User>) {
      const user = await this.findOne(id)  
      if (!user) {
          throw new NotFoundException('User not found')
      }
      Object.assign(user, attrs)
      return this.usersrepo.save(user)
    }

    async remove(id: string){
        const user = await this.findOne(id)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return [this.usersrepo.remove(user), "User successfully removed"]
    }

    

}
