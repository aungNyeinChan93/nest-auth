/* eslint-disable prettier/prettier */


import { Module } from '@nestjs/common';
import { UserRegisterListener } from './listener/user-register.listener';

@Module({
    providers: [UserRegisterListener],
    exports: [],
    imports: [],
})
export class EventsModule { }
