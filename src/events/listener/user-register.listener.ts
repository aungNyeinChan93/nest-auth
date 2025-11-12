/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MailService } from "src/mail/mail.service";
import { User } from "src/users/entities/user.entity";


@Injectable()
export class UserRegisterListener {
    constructor(
        private mailService: MailService
    ) { };

    @OnEvent('user.register')
    userCreate(payload: Pick<User, 'email'>) {
        // TODO - welcome email send to user!
        console.log(payload?.email);
        const html = ` this is welcome mail -${payload?.email}`;
        const subject = 'Welcome mail'
        this.mailService.sendEmail({ to: payload?.email, html, subject })
    }
}