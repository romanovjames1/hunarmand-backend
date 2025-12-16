// src/product/dto/update-product-translation.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { CreateProductTranslationDto } from './create-product-translation.dto';
import { Languages } from 'src/enums/language.enum';

export class UpdateProductTranslationDto extends PartialType(
  CreateProductTranslationDto,
) {
  @ApiProperty({
    type: 'string',
    enum: Languages,
    description:
      'The language key for this translation (uz, en, ru). This field is REQUIRED to identify which translation to update.',
    example: Languages.UZ,
    required: true,
  })
  @IsEnum(Languages, { message: 'Language must be a valid enum value.' })
  @IsNotEmpty({
    message: 'Language is required to identify the translation to update.',
  })
  language: Languages;

  @ApiPropertyOptional({
    type: 'string',
    example: 'New updated title',
    description: 'The updated product title in the specified language.',
    required: false,
  })
  @IsString({ message: 'Title must be a string.' })
  @IsOptional()
  @MinLength(3, { message: 'Title must be at least 3 characters long.' })
  title?: string;

  @ApiPropertyOptional({
    type: 'string',
    example: 'Revised description content.',
    description: 'The updated product description in the specified language.',
    required: false,
  })
  @IsString({ message: 'Description must be a string.' })
  @IsOptional()
  @MinLength(10, {
    message: 'Description must be at least 10 characters long.',
  })
  description?: string;
}
