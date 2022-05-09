import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity'


describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>

  beforeEach(async () => {
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
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findUsersByEmail returns all users with the given email', async () => {
     const users = await controller.findAllUsersByQuery('email@email.com')
     expect(users.length).toEqual(1)
     expect(users[0].email).toEqual('email@email.com')
  })

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('uuid')
    expect(user).toBeDefined()
    expect(user.id).toEqual('uuid')
  })

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null
    try {
      await controller.findUser('uuid')
    } catch (error) {
      
    }
  })

});
