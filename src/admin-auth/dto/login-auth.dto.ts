import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({
    type: 'string',
    description: 'Admin username',
    example: 'someone12',
  })
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty({
    type: 'string',
    description: 'Admin password',
    example: 'someone12:1P',
  })
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least: 1 number 1 lowecase letter 1 uppercase letter 1 symbol and be 6 characters long ',
  })
  @IsStrongPassword({ minLength: 6 })
  @IsNotEmpty()
  password: string;
}
