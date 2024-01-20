import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Date, ObjectId } from "mongoose";

import { Subject as SubjectModel } from "src/subject/entities/subject.entity";
import { Proof as ProofModel } from "src/proof/entities/proof.entity";
import { User as UserModel } from "src/user/entities/user.entity";
import { IsoDatePipe } from "../pipes/iso-date.pipe";

@Schema()
export class Absence {
    @Prop({required: true, type: Date })
    absenceDate        : Date;

    @Prop()
    absenceDescription : string

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: ProofModel.name})
    proof              : ObjectId;

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: SubjectModel.name})
    subject            : ObjectId;

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: UserModel.name})
    user               : ObjectId;
}

export const AbsenceSchema = SchemaFactory.createForClass( Absence );
