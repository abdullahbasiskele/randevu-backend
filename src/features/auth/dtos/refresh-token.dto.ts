import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Sunucunun verdigi refresh token',
    minLength: 32,
  })
  refreshToken!: string;
}
