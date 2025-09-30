import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import type { AuthSession } from '../../../domain/models/auth.types';
import { AuthService } from '../../services/auth.service';
import { RegisterLocalUserCommand } from '../impl/register-local-user.command';

@CommandHandler(RegisterLocalUserCommand)
export class RegisterLocalUserHandler
  implements ICommandHandler<RegisterLocalUserCommand, AuthSession>
{
  constructor(private readonly authService: AuthService) {}

  async execute(command: RegisterLocalUserCommand): Promise<AuthSession> {
    return this.authService.registerLocalUser(command.email, command.password);
  }
}
