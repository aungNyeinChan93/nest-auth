/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "../entities/user.entity";


export class CreateUserDto {
    @IsOptional()
    id?: number;

    @IsNotEmpty({ message: 'name field is required!' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'email field is required!' })
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: 'password field is required!' })
    password: string;

    @IsOptional()
    role?: UserRole | string;

    @IsOptional()
    created_at?: Date;

    @IsOptional()
    updated_at?: Date;
}
