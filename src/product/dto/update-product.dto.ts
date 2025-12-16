// src/product/dto/update-product.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import {
  IsArray,
  IsOptional,
  ValidateNested,
  IsString,
  IsNumber,
  IsMongoId,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UpdateProductTranslationDto } from 'src/product-translation/dto/update-product-translation.dto';
import { PartialProductTranslationDto } from './partial.update.product.dto';
import { UpdateProductType } from './product.types';

export class UpdateProductDto implements UpdateProductType {
  @ApiPropertyOptional({
    type: 'number',
    description: 'The updated product price.',
    example: 120.99,
    required: false,
  })
  @IsNumber({}, { message: 'Price must be a number.' })
  @Min(0, { message: 'Price cannot be negative.' })
  @Transform(({ value }) => {
    if (typeof value === 'string' && value) return Number(value);
    return value;
  })
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'update product thumbnail',
  })
  thumbnail?: Express.Multer.File;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
    description: 'update product image',
  })
  images?: Express.Multer.File[];

  @ApiPropertyOptional({
    type: 'string',
    example: '60c1d636b0f1b2001c8c4a9d',
    description: 'The Mongoose ObjectId of the new parent Category.',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsMongoId({ message: 'Category ID must be a valid Mongo ObjectId.' })
  categoryId?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Updated color.',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Updated size.',
    required: false,
  })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiPropertyOptional({
    type: 'number',
    description: 'Updated stock quantity.',
    example: 5,
    required: false,
  })
  @IsNumber({}, { message: 'Stock quantity must be a number.' })
  @Min(0, { message: 'Stock quantity cannot be negative.' })
  @Transform(({ value }) => {
    if (typeof value === 'string' && value) return Number(value);
  })
  @IsOptional()
  stockQuantity?: number;

  @ApiPropertyOptional({
    type: [UpdateProductTranslationDto],

    description:
      'Optional array of translations to update. Each object MUST include the `language` key to identify the record to update.',
    required: false,
  })
  @IsArray({ message: 'Translations must be an array.' })
  @ValidateNested({ each: true })
  @Type(() => PartialProductTranslationDto)
  @IsOptional()
  translations?: PartialProductTranslationDto[];
}
