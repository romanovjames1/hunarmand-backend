import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Languages } from 'src/enums/language.enum';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    type: 'string',
    description: 'Category title',
    example: 'something',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;
  @ApiProperty({
    type: 'string',
    enum: Languages,
    description: 'Category language',
    example: Languages.UZ,
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(Languages)
  language?: Languages;
}
