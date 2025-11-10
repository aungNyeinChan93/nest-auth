/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle } from '@nestjs/throttler';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @SkipThrottle({ login: true, default: true })
  // @Throttle({ default: { ttl: 60000, limit: 3 } })
  getHello(): string {
    return this.appService.getHello();
  }
}
