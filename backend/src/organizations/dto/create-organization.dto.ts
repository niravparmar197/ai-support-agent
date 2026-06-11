import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'slug can contain only lowercase letters, numbers, and hyphens',
  })
  slug!: string;
}