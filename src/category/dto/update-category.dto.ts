// src/category/dto/update-category.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({
    description: 'The updated category title in English.',
    example: 'Updated Electronics',
    minLength: 2,
    required: false,
  })
  @IsString({ message: 'English title must be a string.' })
  @IsOptional()
  @MinLength(2, {
    message: 'English title must be at least 2 characters long.',
  })
  title_en?: string;

  @ApiPropertyOptional({
    description: 'The updated category title in Uzbek.',
    example: 'Yangilangan Elektronika',
    minLength: 2,
    required: false,
  })
  @IsString({ message: 'Uzbek title must be a string.' })
  @IsOptional()
  @MinLength(2, { message: 'Uzbek title must be at least 2 characters long.' })
  title_uz?: string;

  @ApiPropertyOptional({
    description: 'The updated category title in Russian.',
    example: 'Обновленная Электроника',
    minLength: 2,
    required: false,
  })
  @IsString({ message: 'Russian title must be a string.' })
  @IsOptional()
  @MinLength(2, {
    message: 'Russian title must be at least 2 characters long.',
  })
  title_ru?: string;
}
