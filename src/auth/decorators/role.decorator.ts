/* eslint-disable prettier/prettier */

import { SetMetadata } from "@nestjs/common"
import { UserRole } from "src/users/entities/user.entity"


export const ROLE_KEY = 'roles';

export const Roles = (...role: UserRole[]) => SetMetadata(ROLE_KEY, role)



