import { IsNumber, IsOptional, IsString, Length, MinLength } from "class-validator";
import { RoleEnum } from "../interface";

export class LoginUserDto {
    @IsNumber()
    dni  : number;

    @MinLength(8)
    password ?: string;
}