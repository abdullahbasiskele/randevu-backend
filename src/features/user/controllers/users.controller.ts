import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Action } from '../../auth/ability/casl-ability.factory';
import { CheckPolicies } from '../../auth/decorators/check-policies.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '../../auth/guards/policies.guard';
import { UserListItemDto } from '../dtos/user.dto';
import { GetUsersQuery } from '../application/queries/impl/get-users.query';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'User'))
  @ApiOkResponse({
    description: 'Kayitli kullanicilarin listesi',
    type: UserListItemDto,
    isArray: true,
  })
  async findAll(): Promise<UserListItemDto[]> {
    return this.queryBus.execute(new GetUsersQuery());
  }
}
