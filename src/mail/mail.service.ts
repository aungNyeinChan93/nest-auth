/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { Resend } from 'resend'
import { EmailInterface } from './interfaces/welcome-mail.interface';

@Injectable()
export class MailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    };

    // general email send
    async sendEmail(ctx: EmailInterface) {
        try {
            const { data, error } = await this.resend.emails.send({
                from: ctx.from || 'onboarding@resend.dev',
                to: ctx.to,
                subject: ctx.subject,
                html: ctx.html,
            });

            if (error) {
                console.error('Email sending failed:', error);
                throw new Error(error.message);
            }

            console.log('Email sent:', data);
            return data;
        } catch (err) {
            console.error('Error sending email:', err);
            throw err;
        }
    }

    // 

    // 
}



