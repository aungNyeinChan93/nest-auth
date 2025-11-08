/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto {

    @IsOptional()
    id?: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    body: string;

    @IsOptional()
    created_at?: Date;

    @IsOptional()
    updated_at?: Date

}
