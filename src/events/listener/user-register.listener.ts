/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */

import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MailService } from "src/mail/mail.service";
import { User } from "src/users/entities/user.entity";


@Injectable()
export class UserRegisterListener {
    private logger = new Logger(UserRegisterListener.name, { timestamp: true })

    constructor(
        private mailService: MailService,
    ) { };

    @OnEvent('user.register')
    async userCreate(payload: Pick<User, 'email'>) {

        // TODO - welcome email send to user!
        this.logger.log(payload?.email)
        const html = ` this is welcome mail -${payload?.email}`;
        const subject = 'Welcome mail'

        try {
            const result = await this.mailService.sendEmail({ to: payload?.email, html, subject })
            this.logger.log(JSON.stringify(result, null, 2))
        } catch (error) {
            console.error(error instanceof Error ? error?.message : 'server err')
            this.logger.log(error instanceof Error ? error?.message : 'send email fail')
        }
    }

}