/* eslint-disable prettier/prettier */

import { UserRole } from "src/users/entities/user.entity";


export interface AccessTokenPayload {
    email: string;
    sub: number;
    role: UserRole | string
}