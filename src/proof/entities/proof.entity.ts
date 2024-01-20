import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ProofEnum } from "../interface";

@Schema()
export class Proof {
    @Prop({ required: true })
    proof: ProofEnum;
}

export const ProofSchema = SchemaFactory.createForClass( Proof );