import type { AuthenticatedUser } from '../../auth.types';

export class LoginCommand {
  constructor(public readonly user: AuthenticatedUser) {}
}
