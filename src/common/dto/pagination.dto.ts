/* eslint-disable prettier/prettier */

import { IsNumberString, IsOptional } from "class-validator";


export class PaginationDto {

    @IsOptional()
    @IsNumberString()
    page?: number | string;

    @IsOptional()
    @IsNumberString()
    limit?: number | string;
}