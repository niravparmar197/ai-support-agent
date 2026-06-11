import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateOrganizationWithOwnerDto {
  @ApiProperty({ example: 'Delta Corp', description: 'The name of the new organization' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  orgName!: string;

  @ApiProperty({ example: 'delta-corp', description: 'The unique slug of the organization' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'orgSlug can contain only lowercase letters, numbers, and hyphens',
  })
  orgSlug!: string;

  @ApiProperty({ example: 'Delta Admin', description: 'The name of the organization owner' })
  @IsString()
  @IsNotEmpty()
  ownerName!: string;

  @ApiProperty({ example: 'admin@deltacorp.com', description: 'The email of the organization owner' })
  @IsEmail()
  ownerEmail!: string;

  @ApiProperty({ example: 'SuperSecure123!', description: 'The password of the organization owner', minLength: 6 })
  @IsString()
  @MinLength(6)
  ownerPassword!: string;
}
