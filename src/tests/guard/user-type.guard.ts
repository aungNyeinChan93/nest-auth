/* eslint-disable prettier/prettier */

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { USER_TYPE } from "../decorators/user-type";
import { UserType } from "../interfaces/user-types";



@Injectable()
export class UserTypeGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
    ) { };

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requestTypes = this.reflector.getAllAndOverride<UserType>
                (
                    USER_TYPE, [context.getHandler(), context.getClass()]
                )
            if (!requestTypes) return false;

            // TODO Define logic for userTypes

            console.log(requestTypes as string)
            return true;

        } catch (error) {
            console.log(error)
            return false;
        }
    }

}