import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { Languages } from 'src/enums/language.enum';
import { CreateProductTranslationDto } from 'src/product-translation/dto/create-product-translation.dto';

export class PartialProductTranslationDto extends PartialType(
  CreateProductTranslationDto,
) {
  @ApiProperty({
    type: 'string',
    enum: Languages,
    description:
      'The language key (uz, en, ru). This field is REQUIRED to identify which translation to update.',
    example: Languages.UZ,
    required: true,
  })
  @IsEnum(Languages)
  @IsNotEmpty()
  language: Languages;
}
