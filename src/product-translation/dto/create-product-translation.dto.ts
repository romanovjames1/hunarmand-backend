// src/product/dto/create-product-translation.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Languages } from 'src/enums/language.enum'; // Ensure the path is correct

export class CreateProductTranslationDto {
  @ApiProperty({
    type: 'string',
    enum: Languages,
    description: 'The language key for this specific translation (en, uz, ru).',
    example: Languages.UZ,
    required: true,
  })
  @IsEnum(Languages, {
    message: 'Language must be a valid enum value (uz, en, ru).',
  })
  @IsNotEmpty()
  language: Languages;

  @ApiProperty({
    type: 'string',
    example: 'Some pill or product (UZ)',
    description: 'Product title in the specified language.',
    required: true,
  })
  @IsString({ message: 'Title must be a string.' })
  @IsNotEmpty({ message: 'Title is required.' })
  @MinLength(3, { message: 'Title must be at least 3 characters long.' })
  title: string;

  @ApiProperty({
    type: 'string',
    example: 'This product is so good in Uzbek.',
    description: 'Product description in the specified language.',
    required: true,
  })
  @IsString({ message: 'Description must be a string.' })
  @IsNotEmpty({ message: 'Description is required.' })
  @MinLength(10, {
    message: 'Description must be at least 10 characters long.',
  })
  description: string;
}
