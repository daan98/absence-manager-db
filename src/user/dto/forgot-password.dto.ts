import { IsString, MinLength } from "class-validator";

export class ForgotPasswordDto {
    @IsString()
    dni             : string;

    @MinLength(8)
    newPassword     : string;

    @MinLength(8)
    confirmPassword : string;
}