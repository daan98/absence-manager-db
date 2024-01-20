import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { RoleEnum } from "../interface";
import { ObjectId } from "mongoose";

@Schema()
export class User {
    _id ?: string;
    
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, minlength: 8 })
    dni: number;

    @Prop({ minlength: 8 })
    password?: string;

    @Prop({ required: true, default: RoleEnum.student })
    role: RoleEnum;
}

export const UserSchema = SchemaFactory.createForClass( User );