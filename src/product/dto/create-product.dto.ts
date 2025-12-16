// src/product/dto/create-product.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  Min,
  IsMongoId,
} from 'class-validator';
import { CreateProductTranslationDto } from 'src/product-translation/dto/create-product-translation.dto';

export class CreateProductDto {
  @ApiProperty({
    type: 'number',
    description: 'Product price.',
    example: 100.5,
  })
  @IsNumber({}, { message: 'Price must be a number.' })
  @Min(0, { message: 'Price cannot be negative.' })
  @Transform(({ value }) => {
    if (typeof value === 'string' && value) return Number(value);
    return value;
  })
  @IsNotEmpty({ message: 'Price is required.' })
  price: number;

  @ApiProperty({
    type: 'string',
    description: 'Product color.',
    example: 'black',
  })
  @IsString({ message: 'Color must be a string.' })
  @IsNotEmpty({ message: 'Color is required.' })
  color: string;

  @ApiProperty({
    type: 'string',
    description: 'Product size.',
    example: 'XL',
  })
  @IsString({ message: 'Size must be a string.' })
  @IsNotEmpty({ message: 'Size is required.' })
  size: string;

  @ApiProperty({
    type: 'number',
    description: 'Product stock quantity.',
    example: 10,
  })
  @IsNumber({}, { message: 'Stock quantity must be a number.' })
  @Min(0, { message: 'Stock quantity cannot be negative.' })
  @Transform(({ value }) => {
    if (typeof value === 'string' && value) return Number(value);
  })
  @IsNotEmpty({ message: 'Stock quantity is required.' })
  stockQuantity: number;

  @ApiProperty({
    type: 'string',
    example: '60c1d636b0f1b2001c8c4a9d',
    description: 'The Mongoose ObjectId of the parent Category.',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: 'Category ID must be a valid Mongo ObjectId.' })
  categoryId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Product thumbnail image file.',
    required: true,
  })
  thumbnail: Express.Multer.File;

  @ApiProperty({
    isArray: true,
    type: 'string',
    format: 'binary',
    description: 'Product image files (array).',
    required: true,
  })
  images: Express.Multer.File[];

  @ApiProperty({
    type: [CreateProductTranslationDto],
    description:
      'Array of translations for the product (must include at least one).',
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateProductTranslationDto)
  // @Transform(({ value }) => {
  //   if (typeof value === 'string') {
  //     try {
  //       return JSON.parse(value);
  //     } catch (e) {
  //       return value;
  //     }
  //   }
  //   return value;
  // })
  @IsArray({ message: 'Translations must be an array.' })
  @IsNotEmpty({ message: 'At least one translation is required.' })
  translations: CreateProductTranslationDto[];
}
