import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminAuthDto {
  @ApiProperty({
    type: 'string',
    description: 'Admin username',
    example: 'someone',
  })
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty({
    type: 'string',
    description: 'Admin password',
    example: 'SomeStrongPassword12:2',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
