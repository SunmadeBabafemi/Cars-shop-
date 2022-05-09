import { Controller, Post, Body, Session, Get, Param, NotFoundException, UseGuards } from "@nestjs/common";
import { UsersService } from '../users/users.service';
import { CurrentUser } from "../users/decorators/current-user.decorator";
import { AuthService } from "./auth.service";
import { Serialize } from "../intereptors/serialize.interceptor";
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { User } from "../entities/user.entity";
import { AuthGuard } from "./auth.guard";

@Controller('auth')
@Serialize(UserDto)
export class AuthController{
    constructor(
        private authService: AuthService,
        ){}

    @UseGuards(AuthGuard)
    @Get('/who-goes-there')
    whoGoesThere(@CurrentUser() user: User){
     return user

    }


    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id
        return user
        
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Post('/signout')
    async signout(@Session() session: any){
        session.userId = null
    }

}