/* eslint-disable prettier/prettier */


import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AccessTokenPayload } from "../interfaces/auth.interfaces";
import { AuthService } from "../auth.service";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private authService: AuthService,
        private userService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'access_secret'
        })
    }

    async validate(payload: AccessTokenPayload): Promise<Omit<User, 'password'>> {
        try {
            const user = await this.userService.findOne(payload?.sub)
            if (!user) throw new NotFoundException('user is not found')
            return user;

        } catch (error) {
            console.error(error)
            throw new UnauthorizedException('Token is invalid')
        }
    }
}