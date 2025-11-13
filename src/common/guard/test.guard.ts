import { Roles } from './../../auth/decorators/role.decorator';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_KEY } from "src/auth/decorators/role.decorator";
import { UserRole } from "src/users/entities/user.entity";


@Injectable()
export class TestGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
    ) { }

    canActivate(context: ExecutionContext): boolean {

        // const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLE_KEY, [context.getHandler(), context.getClass()])

        try {
            const { query, user } = context.switchToHttp().getRequest();

            if (!query?.test) return false;

            const isUser = user.role === UserRole.USER;

            if (!isUser) return false;

            return true;
        } catch (error) {
            console.error(error instanceof Error ? error?.message : 'err in TestGuard!')
            return false;
        }
    }
}
