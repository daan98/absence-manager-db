import { PartialType } from '@nestjs/mapped-types';
import { CreateAbsenceDto } from './create-absence.dto';
import { IsDateString, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateAbsenceDto extends PartialType(CreateAbsenceDto) {
    @IsDateString()
    absenceDate        : string;

    @IsString()
    absenceDescription : string;

    @IsString()
    proof              : mongoose.Schema.Types.ObjectId;

    @IsString()
    subject            : mongoose.Schema.Types.ObjectId;

    @IsString()
    user               : mongoose.Schema.Types.ObjectId;
}
