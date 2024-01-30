import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserPasswordDto {
    @IsString()
    password  : string;
}