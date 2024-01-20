import { PartialType } from '@nestjs/mapped-types';
import { CreateProofDto } from './create-proof.dto';
import { IsString } from 'class-validator';
import { ProofEnum } from '../interface';

export class UpdateProofDto extends PartialType(CreateProofDto) {
    @IsString()
    proof : ProofEnum;
}
