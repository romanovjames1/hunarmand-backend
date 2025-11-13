import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  isString,
  IsString,
} from 'class-validator';
import { Categories } from 'src/enums/categories.enum';
import { Languages } from 'src/enums/language.enum';

export class CreateProductDto {
  @ApiProperty({
    type: 'string',
    example: 'Some pill or product',
    description: 'Product title',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: 'string',
    example: 'This product is so good. Doctors always prefer that.',
    description: 'Product description',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: 'number',
    description: 'Product price',
    example: 100,
  })
  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value) return Number(value);
  })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    type: 'string',
    description: 'Product color',
    example: 'black',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    type: 'string',
    description: 'Product size',
    example: 'XL',
  })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({
    type: 'number',
    description: 'Product stock quantity',
    example: 10,
  })
  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value) return Number(value);
  })
  @IsNotEmpty()
  stockQuantity: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Product thumbnail image',
    required: true,
  })
  thumbnail: Express.Multer.File;

  @ApiProperty({
    isArray: true,
    type: 'string',
    format: 'binary',
    description: 'Product images',
    required: true,
  })
  images: Express.Multer.File[];

  @ApiProperty({
    type: 'string',
    example: 1,
    description: 'Product category',
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({
    type: 'string',
    enum: Languages,
    default: Languages.UZ,
    description: 'Product language',
  })
  @IsEnum(Languages)
  @IsOptional()
  language: Languages;
}
