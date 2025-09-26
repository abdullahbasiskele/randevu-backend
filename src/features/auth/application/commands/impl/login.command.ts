import type { AuthenticatedUser } from '../../../domain/models/auth.types';

export class LoginCommand {
  constructor(public readonly user: AuthenticatedUser) {}
}
