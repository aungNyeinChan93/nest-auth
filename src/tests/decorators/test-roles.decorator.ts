/* eslint-disable prettier/prettier */
import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/users/entities/user.entity";


export const TEST_ROLES = 'test-roles';

export const TestRoles = (...role: UserRole[]) => SetMetadata(TEST_ROLES, role)