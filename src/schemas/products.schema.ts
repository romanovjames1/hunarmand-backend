import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Category } from './category.schema';
import { Languages } from 'src/enums/language.enum';

@Schema()
export class Product {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({
    required: true,
  })
  thumbnail: string;
  @Prop({ required: true })
  images: string[];
  @Prop({ required: true })
  color: string;
  @Prop({
    required: true,
  })
  size: string;
  @Prop({
    required: true,
  })
  stockQuantity: number;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  category: Category;
  @Prop({
    type: String,
    enum: Languages,
    required: true,
  })
  language: Languages;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
