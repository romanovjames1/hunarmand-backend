// src/product/schemas/product.schema.ts

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  ProductTranslation,
  ProductTranslationSchema,
} from './product-translation.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product {
  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ required: true })
  images: string[];

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  stockQuantity: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({
    type: [ProductTranslationSchema],
    required: true,
    validate: {
      validator: (translations: ProductTranslation[]) =>
        translations.length > 0,
      message: 'At least one translation is required.',
    },
  })
  translations: ProductTranslation[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
