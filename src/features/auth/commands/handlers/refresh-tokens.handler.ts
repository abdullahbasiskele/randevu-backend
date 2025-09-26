import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../auth.service';
import type { AuthSession } from '../../auth.types';
import { RefreshTokensCommand } from '../impl/refresh-tokens.command';

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensHandler
  implements ICommandHandler<RefreshTokensCommand, AuthSession>
{
  constructor(private readonly authService: AuthService) {}

  async execute(command: RefreshTokensCommand): Promise<AuthSession> {
    return this.authService.refreshTokens(command.refreshToken);
  }
}
