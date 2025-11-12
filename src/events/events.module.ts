/* eslint-disable prettier/prettier */


import { Module } from '@nestjs/common';
import { UserRegisterListener } from './listener/user-register.listener';
import { EventsService } from './events.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
    providers: [UserRegisterListener, EventsService],
    exports: [EventsService],
    imports: [
        EventEmitterModule.forRoot({

        })
    ],
})
export class EventsModule { }
