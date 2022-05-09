import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { User } from "../entities/user.entity";

describe('AuthSErvice', () => {
    let service: AuthService
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {
        const users: User[] = [ ] 
        //create a fake copy of the users service
        fakeUsersService = { // this helps the fakeuserservice to work as the Userservice would work
            findAll:() => Promise.resolve([]),
            create:(email: string, password: string) => {
                const user = {
                 id:'uuid'+ `${email}`,
                 email, 
                 password
                } as User
                users.push(user)
                return Promise.resolve(user)
            },
            findByEmail:(email: string) => {
                const filteredUsers = users.filter(user => user.email === email)
                return Promise.resolve(filteredUsers)
            } 
        }
        
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                }
            ],
        }).compile()
        
        service = module.get(AuthService)
    } )


    it('can create an instance of aut service', async () => {
    
        expect(service).toBeDefined()
    })

    it('should create a new user with an email and hashed password', async () => {
        const user = await service.signup('email1@gmail.com', "password1")
        expect(user.password).not.toEqual('password1')
        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })

    it('should throw an error if user signs up with an already existing email', async () => {
        await service.signup('email1@gmail.com', 'password1')
        try { 
            await service.signup('email1@gmail.com', 'password1')         
        } catch (error) {
            
        }

    })

    it('throws an error if signin is called with no existing email', async () => {
        try {
            await service.signin('email2@gmail.com','password2')            
        } catch (error) {
    
        }
    })

    it('throws an error is password is incorrect', async () => {
        await service.signup('email@gmail.com', 'password123')

        try {
            await service.signin('email@gmail.com', 'password12')
        } catch (error) {
            
        }
    })

    it('returns a user if correct password is provided', async () => {
        await service.signup('email12@emailcom', 'password12')
        const user = await service.signin('email12@emailcom', 'password12')
        expect(user).toBeDefined()
    })

})

