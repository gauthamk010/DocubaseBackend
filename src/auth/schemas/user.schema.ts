import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Role } from '../enums/role.enum';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User{

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: [true, 'Phone number already exists']})
    phoneNumber: string;

    @Prop({ required: true, unique: [true, 'Email already exists']})
    email: string;
  
    @Prop({ required: true })
    password: string;

    @Prop() 
    profileImage: string;

    @Prop({ type: [String], enum: Role, default: [Role.User] })
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User); 