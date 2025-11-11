/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';
import { DrizzleProvider } from './providers/drizzle.provider';

@Module({
  providers: [DrizzleService, DrizzleProvider],
  exports: [DrizzleProvider],

})
export class DrizzleModule { }
