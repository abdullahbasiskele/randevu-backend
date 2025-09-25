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
    description: 'Kullanicinin sahip oldugu izin adlari',
  })
  permissions!: string[];
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: string;

  @ApiProperty({ description: 'Yeni access token uretmek icin kullanilir' })
  refreshToken!: string;

  @ApiProperty({ description: 'Access token suresi (saniye)' })
  expiresIn!: number;

  @ApiProperty({ type: AuthenticatedUserDto })
  user!: AuthenticatedUserDto;
}
