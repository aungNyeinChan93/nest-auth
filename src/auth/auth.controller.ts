/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */


import { Body, Controller, Get, HttpCode, HttpStatus, Post, Scope, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from 'src/users/entities/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/role.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/roles.gurad';
import { Throttle } from '@nestjs/throttler';

@Controller({ path: 'auth', scope: Scope.DEFAULT })
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto)
    }

    @Post('login')
    @Throttle({ login: { ttl: 1000 * 60, limit: 5 } })
    @HttpCode(HttpStatus.CREATED)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    @Post('test-accessToken')
    @HttpCode.apply(HttpStatus.OK)
    async testAccessToken(@Body('token') token: string) {
        return this.authService.verifyAccessToken(token)
    }

    @Post('test-refreshToken')
    @HttpCode(HttpStatus.OK)
    async testRefreshToken(@Body('token') token: string) {
        return this.authService.verifyRefreshToken(token)
    }

    // protected route
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@CurrentUser() user: User) {
        return user;
    }

    // admin && protected
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post('create-admin')
    createAdmin(@Body() registerDto: RegisterDto) {
        return this.authService.createAdmin(registerDto)
    }

}
