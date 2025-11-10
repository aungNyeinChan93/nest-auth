/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AccessTokenPayload } from "../interfaces/auth.interfaces";
import { UsersService } from "src/users/users.service";



@Injectable()
export class CustomeStrategy extends PassportStrategy(Strategy) {

    constructor(
        private userService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'access_secret'
        })
    };

    async validate(payload: AccessTokenPayload) {
        try {
            const user = await this.userService.findOne(payload?.sub);
            if (!user) throw new NotFoundException('token is invalid');
            const { password, ...result } = user;
            return { user: result, password }
        } catch (error) {
            throw new Error(error instanceof Error ? error?.message : 'invalid token')
        }
    }
}
