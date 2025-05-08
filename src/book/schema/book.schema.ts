// book.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Book extends Document {
  @Prop() 
  name: string;
  
  @Prop() 
  author: string;
  
  @Prop() 
  genre: string;
  
  @Prop() 
  description: string;
  
  @Prop() 
  coverImagePath: string;
  
  @Prop() 
  textFilePath: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
