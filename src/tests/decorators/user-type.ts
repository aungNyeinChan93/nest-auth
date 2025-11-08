/* eslint-disable prettier/prettier */

import { SetMetadata } from "@nestjs/common";
import { type UserType } from "../interfaces/user-types";



export const USER_TYPE = 'user-type';
export const UserT = (type: UserType) => SetMetadata(USER_TYPE, type)
