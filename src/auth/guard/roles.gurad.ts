/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */


import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { User, UserRole } from "src/users/entities/user.entity";
import { ROLE_KEY } from "../decorators/role.decorator";


@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requestRoles = this.reflector.getAllAndOverride<UserRole[]>(
                ROLE_KEY,
                [
                    context.getHandler(),
                    context.getClass(),
                ]
            )

            if (!requestRoles) return true;

            const { user }: { user: User } = context.switchToHttp().getRequest();

            if (!user) throw new ForbiddenException('user is not authenticated!')

            const hasRequiredRole = requestRoles.some(role => user.role === role)

            if (!hasRequiredRole) throw new ForbiddenException('user is not authorized!')

            return hasRequiredRole;
        } catch (error) {
            console.error(error)
            throw new Error("Method not implemented.");

        }
    }

}