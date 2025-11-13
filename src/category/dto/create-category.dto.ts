import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Languages } from 'src/enums/language.enum';

export class CreateCategoryDto {
  @ApiProperty({
    type: 'string',
    description: 'Category title',
    example: 'something',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
  @ApiProperty({
    type: 'string',
    enum: Languages,
    description: 'Category language',
    example: Languages.UZ,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(Languages)
  language: Languages;
}
