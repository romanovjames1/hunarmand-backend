import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Languages } from 'src/enums/language.enum';

export class QueryDto {
  @IsOptional()
  @IsString()
  q?: string;
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  limit?: number;
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  page?: number;
  @ApiProperty({
    type: 'string',
    enum: Languages,
    required: false,
    description: 'Product language',
  })
  @IsEnum(Languages)
  @IsOptional()
  language?: Languages;
}
