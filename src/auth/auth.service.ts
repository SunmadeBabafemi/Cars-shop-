import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService} from '../users/users.service'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from "util";


const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService{
    constructor (private  usersService: UsersService){}

    // authentication with scrypt and salting
    async  signup(email: string, password: string){
        // see if email is in use
        const existingUser = await this.usersService.findByEmail(email)
        if (!existingUser) {
            throw new BadRequestException('Email already in use')
        }


        // hash the users password
        // Generate A Salt - the function below is meant to generate a 16 character random string
        const salt = randomBytes(8).toString('hex')
        
        // Hash salt and password together
        const hash = (await scrypt(password, salt, 32)) as Buffer

        // Join the hashed result and the salt together
        const hashedPassword = salt + '.' + hash.toString('hex')

        // create a new user and save it
        const newUser = await this.usersService.create(email, hashedPassword)
        
       // return the user
       return newUser
    }

    async signin(email: string, password: string){
        const [user] = await this.usersService.findByEmail(email)
        if (!user) {
            throw new NotFoundException("User not found")
        }

        const [salt, storedHash] = user.password.split('.')

        const hash = (await scrypt(password, salt, 32)) as Buffer

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('email or password invalid')
        } return user
    }
}   