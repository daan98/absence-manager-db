import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Subject {
    @Prop({ required: true, unique: true })
    subjectName: string;
}

export const SubjectSchema = SchemaFactory.createForClass( Subject );