import { IsString } from "class-validator";

export class GetAbsenceDateDto {
    @IsString()
    absenceDate : string;
}