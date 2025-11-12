/* eslint-disable prettier/prettier */


import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { User } from "src/users/entities/user.entity";


@Injectable()
export class UserLoginListiner {

    private logger = new Logger(UserLoginListiner.name, { timestamp: true })

    constructor(

    ) { }

    @OnEvent('user.login')
    userLoign(payload: Pick<User, 'name'>) {
        this.logger.log(`${payload?.name} was login at ${new Date().toLocaleTimeString()}`)
    }
}