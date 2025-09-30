import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'vatandas@randevu.local' })
  email!: string;

  @ApiProperty({ example: 'Guv3nliParola!' })
  password!: string;
}
