// src/category/dto/create-category.dto.ts

import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsUrl, // Assuming icon might be a URL
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The category title in English.',
    example: 'Electronics',
    minLength: 2,
  })
  @IsString({ message: 'English title must be a string.' })
  @IsNotEmpty({ message: 'English title is required.' })
  @MinLength(2, {
    message: 'English title must be at least 2 characters long.',
  })
  title_en: string;

  @ApiProperty({
    description: 'The category title in Uzbek.',
    example: 'Elektronika',
    minLength: 2,
  })
  @IsString({ message: 'Uzbek title must be a string.' })
  @IsNotEmpty({ message: 'Uzbek title is required.' })
  @MinLength(2, { message: 'Uzbek title must be at least 2 characters long.' })
  title_uz: string;

  @ApiProperty({
    description: 'The category title in Russian.',
    example: 'Электроника',
    minLength: 2,
  })
  @IsString({ message: 'Russian title must be a string.' })
  @IsNotEmpty({ message: 'Russian title is required.' })
  @MinLength(2, {
    message: 'Russian title must be at least 2 characters long.',
  })
  title_ru: string;
}
