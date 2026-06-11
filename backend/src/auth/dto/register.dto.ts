import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email address of the user' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password123!', description: 'Minimum 8 characters password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 'organization-cuid', description: 'The ID of the associated organization' })
  @IsString()
  @IsNotEmpty()
  organizationId!: string;
}