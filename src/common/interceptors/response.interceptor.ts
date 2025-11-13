/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */

import { Logger } from '@nestjs/common';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";



@Injectable()
export class ResponseInterceptor implements NestInterceptor {

    private logger: Logger = new Logger(ResponseInterceptor.name, { timestamp: true });

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        const now = new Date().toISOString();

        const { method, url, body, param, query, user } = context.switchToHttp().getRequest();

        this.logger.log(`method = ${method} | url:${url} | body:${JSON.stringify(body)} | param:${JSON.stringify(param)} | query:${JSON.stringify(query)}`)

        return next.handle().pipe(map((data) => ({
            status: 'success',
            time: now,
            data,
            user,
            method,
            url,
            param,
            query,
            body,
        })))
    }
}