/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsOptional()
    id?: number;


    @IsNotEmpty()
    @IsString()
    name: string;


    @IsOptional()
    created_at: Date;

    @IsOptional()
    updated_at: Date;

}
