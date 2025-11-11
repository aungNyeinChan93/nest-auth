/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TestGuard } from './guard/testguard';
import { TestRolesGuard } from './guard/test-roles.guard';
import { UserTypeGuard } from './guard/user-type.guard';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [TestsController],
  providers: [TestsService, TestGuard, TestRolesGuard, UserTypeGuard],
  imports: [
    JwtModule.register({}),
    PassportModule,
    DrizzleModule
  ]
})
export class TestsModule { }
