import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction} from "express"
import { UsersService } from "../users.service";
import { User } from "src/entities/user.entity";

declare global {
    namespace Express {
        interface Request {
            currentUser? :User
        }
    }
} // Express request interface does not naturally have a currentUser as part of 
// its properties. This has to be manually created so it can be 
// referenced in the middleware

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(
        private usersService: UsersService
    ){}

    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {}

        if (userId) {
            const user = await this.usersService.findOne(userId)
            // @ts-ignore
            req.currentUser = user
        }

        next()
    }
}