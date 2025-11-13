import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminAuthDto } from './create-admin-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAdminAuthDto extends PartialType(CreateAdminAuthDto) {
  @ApiProperty({
    type: 'string',
    description: 'Admin username',
    example: 'someone',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;
  @ApiProperty({
    type: 'string',
    description: 'Admin password',
    example: 'SomeStrongPassword12:2',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;
}
