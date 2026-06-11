import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class InviteUserDto {
  @ApiProperty({ example: 'jane@example.com', description: 'The email address of the invited user' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Jane Doe', description: 'The name of the invited user' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.SUPPORT, description: 'The role assigned to the invited user' })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({ example: 'organization-cuid-id', description: 'The ID of the organization the user is being invited to' })
  @IsString()
  @IsNotEmpty()
  organizationId!: string;
}
