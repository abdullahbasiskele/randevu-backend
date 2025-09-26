import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../auth.service';
import type { AuthSession } from '../../auth.types';
import { LoginCommand } from '../impl/login.command';

@CommandHandler(LoginCommand)
export class LoginHandler
  implements ICommandHandler<LoginCommand, AuthSession>
{
  constructor(private readonly authService: AuthService) {}

  async execute(command: LoginCommand): Promise<AuthSession> {
    return this.authService.login(command.user);
  }
}
