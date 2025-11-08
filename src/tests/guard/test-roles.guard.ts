/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { TEST_ROLES } from './../decorators/test-roles.decorator';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, throwError } from "rxjs";
import { User, UserRole } from "src/users/entities/user.entity";


@Injectable()
export class TestRolesGuard implements CanActivate {

    constructor(
        private reflector: Reflector
    ) { };

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const testRoles = this.reflector.getAllAndOverride<UserRole[]>(
                TEST_ROLES,//'test-roles'
                [
                    context.getHandler(),
                    context.getClass(),
                ]
            );
            if (!testRoles) return false;

            const { user }: { user: User } = context.switchToHttp().getRequest();

            if (!user) throw new UnauthorizedException('user is not authenticated')

            const hasTestRoles = testRoles?.some(role => role === user?.role);
            // const isGuestRole = user?.role === UserRole.GUEST;

            if (!hasTestRoles) throw new UnauthorizedException('current user is not authorized')

            return hasTestRoles;

        } catch (error) {
            console.error(error instanceof Error ? error?.message : "test role is invalid")
            throw new UnauthorizedException(error instanceof Error ? error?.message : 'role not access')
        }
    }

}