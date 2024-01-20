import { IsNumber, IsOptional, IsString, Length, MinLength } from "class-validator";
import { RoleEnum } from "../interface";

export class CreateUserDto {
    @IsString()
    name      : string;

    @IsString()
    lastName  : String;

    @IsNumber()
    dni       : number;

    @IsString()
    role      : RoleEnum;

    @IsOptional()
    @MinLength(8)
    password ?: string;
}
