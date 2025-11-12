/* eslint-disable prettier/prettier */


import { Module } from '@nestjs/common';
import { UserRegisterListener } from './listener/user-register.listener';
import { EventsService } from './events.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from 'src/mail/mail.module';
import { UserLoginListiner } from './listener/user-login.listiner';

@Module({

    providers: [
        UserRegisterListener,
        EventsService,
        UserLoginListiner
    ],

    exports: [EventsService],

    imports: [
        EventEmitterModule.forRoot({}),
        MailModule,
    ],
})
export class EventsModule { }
