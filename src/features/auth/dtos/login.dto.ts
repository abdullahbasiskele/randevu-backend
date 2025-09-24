import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@randevu.local' })
  email!: string;

  @ApiProperty({ example: '123123' })
  password!: string;
}

export class RoleSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;
}

export class AuthenticatedUserDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({ type: [RoleSummaryDto] })
  roles!: RoleSummaryDto[];

  @ApiProperty({
    type: [String],
    description: 'Kullanıcının sahip olduğu izin adları',
  })
  permissions!: string[];
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: string;

  @ApiProperty({ type: AuthenticatedUserDto })
  user!: AuthenticatedUserDto;
}
