import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../domain/repositories/user.repository';
import type { UserSummary } from '../../../domain/models/user.model';
import { GetUsersQuery } from '../impl/get-users.query';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler
  implements IQueryHandler<GetUsersQuery, UserSummary[]>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserSummary[]> {
    return this.userRepository.findAllSummaries();
  }
}
