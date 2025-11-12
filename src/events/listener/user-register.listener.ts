/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { User } from "src/users/entities/user.entity";


@Injectable()
export class UserRegisterListener {

    @OnEvent('user.register')
    userCreate(payload: Pick<User, 'email'>) {
        // TODO - welcome email send to user!
        console.log(payload?.email);
    }
}