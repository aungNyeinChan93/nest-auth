/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EventsService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
    ) { };

    // user register
    userRegisterEmit(user: Omit<User, 'password'>) {
        this.eventEmitter.emit('user.register', user)
    }

    // user login
    userLoginEmit(user: Omit<User, 'password'>) {
        this.eventEmitter.emit('user.login', user)
    }

}
