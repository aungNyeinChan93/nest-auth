/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from "express";


export const TestMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const logger = new Logger('Test Middleware', { timestamp: true });
    const userAgent = req.get('user-agent') || 'unknown';

    const startTime = Date.now()
    req['start_time'] = startTime;

    req.on('end', () => {
        const duration = Date.now() - req['start_time'];
        const { statusCode } = res;

        if (statusCode >= 500) {
            logger.error(statusCode)
        } else if (statusCode >= 400) {
            logger.error(statusCode)
        } else {
            logger.log(duration)
            logger.log(`${userAgent}`)
        }

    })

    next();
} 