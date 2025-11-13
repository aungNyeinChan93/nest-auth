/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request } from "express";
import { Response } from "supertest";


@Injectable()
export class LoggerMiddleware implements NestMiddleware {

    private logger: Logger = new Logger(LoggerMiddleware.name, { timestamp: true })

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, params, query } = req
        this.logger.log({
            method, originalUrl, params, query: JSON.stringify(query)
        });
        next();
    }

}