import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common'


import { UsersService } from '../users.service'

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor{
    constructor(private userservice: UsersService){}

    async intercept(context: ExecutionContext, handler: CallHandler<any>){
        const request = context.switchToHttp().getRequest()
        // const  userId  = request.session
        const  {userId}  = request.session


        if (userId) {
            const user = await this.userservice.findOne(userId)
            request.currentUser = user
        }
        return handler.handle() // this means that it should just go ahead and handle the route handler
    }
}