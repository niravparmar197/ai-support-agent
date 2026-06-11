import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'Jane Doe', description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'jane@example.com', description: 'The email address of the user' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password123!', description: 'The password of the user (min 6 characters)', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @ApiProperty({ example: 'organization-cuid-id', description: 'The associated organization ID' })
  @IsString()
  @IsNotEmpty()
  organizationId!: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.SUPPORT, description: 'The authorization role of the user' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.SUPPORT;

  @ApiPropertyOptional({ enum: UserStatus, default: UserStatus.ACTIVE, description: 'The status of the user account' })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus = UserStatus.ACTIVE;
}
