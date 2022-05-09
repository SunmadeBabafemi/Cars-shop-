import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service'
import { User } from '../entities/user.entity'
import { UsersService } from '../users/users.service'

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>
  let fakeUsersService: Partial<UsersService>


  beforeEach(async () => {
    fakeAuthService ={
        //  implement signup an signin
        signin: (email: string, password: string) => {
            return Promise.resolve({id: 'uuid', email, password} as User)
        },
        signup:  (email: string, password: string) => {
            return Promise.resolve({id: 'uuid', email, password} as User)
        },
    }

    fakeUsersService = {
        // implement findall, queryfind, findone, findbyemail, remove and update
        findAll: () => {
          return Promise.resolve([{id: 'uuid', email:'email@email.com', password: 'password'} as User])
  
        },
        findByEmail:(email: string)  => {
          return Promise.resolve([{id: 'uuid', email, password: 'password'} as User])
          
        },
        findOne:(id: string)  => {
          return Promise.resolve({id, email: 'email@email.com', password: 'password'} as User)
          
        },
        // remove:(id)  => {
          
        // },
        // update:(id, attrs)  => {
          
        // },
        queryFind:(email: string)  => {
          return Promise.resolve([{id:'uuid', email, password: 'password'} as User])
          
        },
      }
    const module: TestingModule = await Test.createTestingModule({
    controllers: [AuthController],
    providers: [
        {
            provide: AuthService,
            useValue: fakeAuthService
        },
        {
            provide: UsersService,
            useValue: fakeUsersService
        }
    ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
 });
  

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signin, uodates session object and returns user', async () => {
      const session = {userId: 'diuu'}
      const user = await controller.signin({email:'email@email.com', password:'password'}, session)
      expect(user.id).toEqual('uuid')
      expect(session.userId).toEqual('uuid')
  })
});
