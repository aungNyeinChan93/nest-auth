/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsOptional()
    id?: number;


    @IsNotEmpty()
    @IsString()
    name: string;


    @IsNotEmpty()
    price: number;


    @IsNotEmpty()
    qty: number;


    @IsOptional()
    created_at: Date;

    @IsOptional()
    updated_at: Date;
}
