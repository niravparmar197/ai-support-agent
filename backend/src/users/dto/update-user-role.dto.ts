import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.SUPPORT, description: 'The new role of the user' })
  @IsEnum(UserRole)
  role!: UserRole;
}
