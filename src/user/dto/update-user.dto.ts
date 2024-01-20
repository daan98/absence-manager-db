import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { RoleEnum } from '../interface';
import { IsOptional, IsString, isString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name     : string;

    @IsOptional()
    @IsString()
    lastName : string;

    @IsOptional()
    @IsString()
    role     : RoleEnum

    @IsOptional()
    @IsString()
    password ?: string;
}
