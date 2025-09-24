import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Action } from '../../auth/ability/casl-ability.factory';
import { CheckPolicies } from '../../auth/decorators/check-policies.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '../../auth/guards/policies.guard';
import { UsersService } from '../services/user.service';
import { UserListItemDto } from '../dtos/user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'User'))
  @ApiOkResponse({
    description: 'Kayıtlı kullanıcıların listesi',
    type: UserListItemDto,
    isArray: true,
  })
  async findAll(): Promise<UserListItemDto[]> {
    return this.usersService.findAllBasic();
  }
}
