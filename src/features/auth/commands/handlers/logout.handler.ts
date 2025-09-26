import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../auth.service';
import { LogoutCommand } from '../impl/logout.command';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand, void> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LogoutCommand): Promise<void> {
    await this.authService.logout(command.refreshToken);
  }
}
