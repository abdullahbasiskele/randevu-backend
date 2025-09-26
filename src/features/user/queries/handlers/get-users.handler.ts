import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import { UsersService } from '../../services/user.service';
import { GetUsersQuery } from '../impl/get-users.query';

type UsersListResult = Awaited<ReturnType<UsersService['findAllBasic']>>;

@QueryHandler(GetUsersQuery)
export class GetUsersHandler
  implements IQueryHandler<GetUsersQuery, UsersListResult>
{
  constructor(private readonly usersService: UsersService) {}

  async execute(): Promise<UsersListResult> {
    return this.usersService.findAllBasic();
  }
}
