/* eslint-disable prettier/prettier */

import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload } from './interfaces/auth.interfaces';

@Injectable()
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
            secret: 'access_token',
            expiresIn: '30m'
        })
    }

    private generateRefreshToken(user: User): string {
        const refreshTokenPayload: Partial<AccessTokenPayload> = {
            sub: user?.id,
        };
        return this.jwtService.sign(refreshTokenPayload, {
            secret: 'access_token',
            expiresIn: '30m'
        })
    }
}
