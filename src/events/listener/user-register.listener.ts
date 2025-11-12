/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { User } from "src/users/entities/user.entity";


@Injectable()
export class UserRegisterListener {

    @OnEvent('user.created')
    userCreate(payload: User) {
        // TODO - welcome email send to user!
        console.log(payload?.name)
    }
}