import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'The email address of the user' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password123!', description: 'The password of the user' })
  @IsString()
  password!: string;
}