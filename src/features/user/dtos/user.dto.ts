import { ApiProperty } from '@nestjs/swagger';

export class UserListItemDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  isActive!: boolean;
}
