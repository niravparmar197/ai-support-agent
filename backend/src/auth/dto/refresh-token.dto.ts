import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'The refresh token value returned from /auth/login' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
