/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './startegies/jwt.strategy';
import { RolesGuard } from './guard/roles.gurad';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { EventsModule } from 'src/events/events.module';
// import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, JwtAuthGuard],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ global: true }),
    PassportModule,
    UsersModule,
    EventsModule,
  ],
  exports: [AuthService, RolesGuard, JwtAuthGuard]
})
export class AuthModule { }
