// src/category/schemas/category.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
// Note: Removed unused imports like 'Product' and 'Languages' for a cleaner schema

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  timestamps: true,
  collection: 'categories',
})
export class Category {
  @Prop({ required: true, trim: true })
  title_en: string;

  @Prop({ required: true, trim: true })
  title_uz: string;

  @Prop({ required: true, trim: true })
  title_ru: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
