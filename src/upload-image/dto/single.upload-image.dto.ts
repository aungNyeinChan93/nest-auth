/* eslint-disable prettier/prettier */

import { IsOptional } from "class-validator";


export class SingleUploadImageDto {

    @IsOptional()
    id?: number

    @IsOptional()
    image: File

    @IsOptional()
    created_at: Date;

    @IsOptional()
    updated_at: Date;

}