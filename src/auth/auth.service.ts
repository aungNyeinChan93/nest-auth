/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */

import { ConflictException, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload } from './interfaces/auth.interfaces';


@Injectable({ scope: Scope.DEFAULT })
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const isExists = !!(await this.userRepo.findOne({ where: { email: registerDto?.email } }))
        if (isExists) throw new ConflictException('Email is Already used!');
        const hashPassword = await this.hashPassword(registerDto?.password)
        const user = this.userRepo.create({ ...registerDto, created_at: new Date(), password: hashPassword });
        const saveUser = await this.userRepo.save(user);
        const { password, ...result } = saveUser;
        return { user: result, password }
    }

    async login(loginDto: LoginDto) {
        const user = (await this.userRepo.findOne({ where: { email: loginDto?.email } }))
        if (!user) throw new NotFoundException('Your email is not valid!');

        if (!(await this.verifyPassword(loginDto?.password, user?.password))) {
            throw new UnauthorizedException('User credential is not correct!')
        };

        const { accessToken, refreshToken } = this.generateTokens(user)

        const { password, ...result } = user;

        return {
            user: result,
            accessToken,
            refreshToken,
            password
        }
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, await bcrypt.genSalt(10))
    }

    async verifyPassword(plainPassword: string, hashPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashPassword)
    }

    generateTokens(user: User) {
        return {
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user)
        }
    }

    private generateAccessToken(user: User): string {
        const accessTokenPayload: AccessTokenPayload = {
            email: user?.email,
            sub: user?.id,
            role: user?.role
        };
        return this.jwtService.sign(accessTokenPayload, {
            secret: 'access_secret',
            expiresIn: '30m'
        })
    }

    private generateRefreshToken(user: User): string {
        const refreshTokenPayload: Partial<AccessTokenPayload> = {
            sub: user?.id,
        };
        return this.jwtService.sign(refreshTokenPayload, {
            secret: 'refresh_secret',
            expiresIn: '7d'
        })
    }

    async verifyAccessToken(token: string) {
        const accessTokenPayload: AccessTokenPayload = await this.jwtService.verify(token, {
            secret: 'access_secret'
        });
        const user = await this.userRepo.findOne({ where: { email: accessTokenPayload?.email } })
        if (!user) throw new NotFoundException('User not found!')
        const { password, ...result } = user;
        return { user: result, password }
    }

    async verifyRefreshToken(token: string) {
        const refreshPayload: Partial<AccessTokenPayload> = await this.jwtService.verify(token, {
            secret: 'refresh_secret'
        })
        if (!refreshPayload) throw new NotFoundException('refresh token is in valid!')
        const user = await this.userRepo.findOne({ where: { id: refreshPayload?.sub } })
        if (!user) throw new NotFoundException('User not found!')
        const { password, ...result } = user;
        return { user: result, password }
    }

    async createAdmin(registerDto: RegisterDto): Promise<User> {
        const user = this.userRepo.create({ ...registerDto, created_at: new Date(), role: UserRole?.ADMIN })
        return await this.userRepo.save(user);
    }

}
