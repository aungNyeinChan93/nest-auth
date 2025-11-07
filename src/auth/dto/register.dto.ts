/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "src/users/entities/user.entity";


export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    role: UserRole

    @IsOptional()
    created_at: Date
}