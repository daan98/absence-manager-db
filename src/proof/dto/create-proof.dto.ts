import { IsString } from "class-validator";
import { ProofEnum } from "../interface";

export class CreateProofDto {
    @IsString()
    proof : ProofEnum;
}
