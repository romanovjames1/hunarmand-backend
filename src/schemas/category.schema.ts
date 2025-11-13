import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Languages } from 'src/enums/language.enum';
import { Product } from './products.schema';

export type CategoryDocument = Category & Document;
@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  title: string;
  @Prop({
    type: String,
    enum: Languages,
    required: true,
  })
  language: Languages;
}

export const CatSchema = SchemaFactory.createForClass(Category);
