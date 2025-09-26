import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import { AuthService } from '../../auth.service';
import type { AuthenticatedUser } from '../../auth.types';
import { GetProfileQuery } from '../impl/get-profile.query';

@QueryHandler(GetProfileQuery)
export class GetProfileHandler
  implements IQueryHandler<GetProfileQuery, AuthenticatedUser>
{
  constructor(private readonly authService: AuthService) {}

  async execute(query: GetProfileQuery): Promise<AuthenticatedUser> {
    return this.authService.getProfile(query.userId);
  }
}
