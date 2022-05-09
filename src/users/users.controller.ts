import { Controller, 
    Post,
    Get, 
    Param, 
    Patch, 
    Body, 
    Query, 
    ParseUUIDPipe, 
    Delete, 
    NotFoundException,

} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../intereptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
 
@Controller('users')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService){}

    @Get()
    async findAllUser(): Promise<User[]>{
        const users = await this.usersService.findAll()
        return users
    }

    @Get()
    findAllUsersByQuery(@Query('email') email: string){
        return this.usersService.queryFind(email)
    }

   
    @Get('/:id')
    async findUser(@Param('id',  new ParseUUIDPipe()) id: string ){
       const user = await this.usersService.findOne(id)
        if (!user) {
            throw new NotFoundException('user not found')
        } return user

    }
    @Post('/user-email')
    async findUserByEmail(@Body() body: FindUserDto){
        return await this.usersService.findByEmail(body.email)
    }

    @Delete('/:id')
    async removeUser(@Param('id', new ParseUUIDPipe()) id: string) {
      return await this.usersService.remove(id)
    }

    @Patch("/:id")
    async updateUser(
        @Param('id', new ParseUUIDPipe()) id: string, 
        @Body() body: UpdateUserDto){
           return await this.usersService.update(id, body) 
        }

}
