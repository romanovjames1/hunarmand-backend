// src/product/schemas/product-translation.schema.ts

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Languages } from 'src/enums/language.enum';

@Schema({ _id: false })
export class ProductTranslation {
  @Prop({
    type: String,
    enum: Languages,
    required: true,
    index: true,
  })
  language: Languages;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

export const ProductTranslationSchema =
  SchemaFactory.createForClass(ProductTranslation);
