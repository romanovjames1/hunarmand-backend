import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Languages } from 'src/enums/language.enum';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    type: 'string',
    example: 'Some pill or product',
    description: 'Product title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    type: 'string',
    example: 'This product is so good. Doctors always prefer that.',
    description: 'Product description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'number',
    description: 'Product price',
    example: 100,
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  price?: number;

  @ApiProperty({
    type: 'string',
    description: 'Product color',
    example: 'black',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    type: 'string',
    description: 'Product size',
    example: 'XL',
    required: false,
  })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({
    type: 'number',
    description: 'Product stock quantity',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  stockQuantity?: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Product thumbnail image',
    required: false,
  })
  @IsOptional()
  thumbnail?: Express.Multer.File;

  @ApiProperty({
    isArray: true,
    type: 'string',
    format: 'binary',
    description: 'Product images',
    required: false,
  })
  @IsOptional()
  images?: Express.Multer.File[];

  @ApiProperty({
    type: 'string',
    example: '691548030b8a94277082630e',
    description: 'Product category',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    type: 'string',
    enum: Languages,
    default: Languages.UZ,
    description: 'Product language',
    required: false,
  })
  @IsEnum(Languages)
  @IsString()
  @IsOptional()
  language?: Languages;
}
