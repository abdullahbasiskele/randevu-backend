/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import type {
  AuthenticatedUser,
  AuthSession,
  AuthTokens,
} from './domain/models/auth.types';
import { LoginCommand } from './application/commands/impl/login.command';
import { RegisterLocalUserCommand } from './application/commands/impl/register-local-user.command';
import { LogoutCommand } from './application/commands/impl/logout.command';
import { RefreshTokensCommand } from './application/commands/impl/refresh-tokens.command';
import { CurrentUser } from './decorators/current-user.decorator';
import {
  AuthenticatedUserDto,
  LoginDto,
  LoginResponseDto,
} from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetProfileQuery } from './application/queries/impl/get-profile.query';

type LocalAuthRequest = Request & { user: AuthenticatedUser };

type LoginResponsePayload = AuthTokens & {
  refreshTokenExpiresAt: string;
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly refreshTokenCookieName = 'refresh_token';

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  private isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  private setRefreshTokenCookie(
    res: Response,
    token: string,
    expiresAt: Date,
  ): void {
    res.cookie(this.refreshTokenCookieName, token, {
      httpOnly: true,
      secure: this.isProduction(),
      sameSite: this.isProduction() ? 'none' : 'lax',
      expires: expiresAt,
      path: '/auth',
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    res.clearCookie(this.refreshTokenCookieName, {
      httpOnly: true,
      secure: this.isProduction(),
      sameSite: this.isProduction() ? 'none' : 'lax',
      path: '/auth',
    });
  }

  private extractRefreshToken(req: Request): string | undefined {
    const cookies = (
      req as Request & {
        cookies?: Record<string, string | undefined>;
      }
    ).cookies;

    return cookies?.[this.refreshTokenCookieName];
  }

  private toLoginResponsePayload(
    tokens: AuthTokens,
    refreshTokenExpiresAt: Date,
  ): LoginResponsePayload {
    return {
      accessToken: tokens.accessToken,
      tokenType: tokens.tokenType,
      expiresIn: tokens.expiresIn,
      user: tokens.user,
      refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString(),
    };
  }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ type: LoginResponseDto })
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponsePayload> {
    const session = await this.commandBus.execute<
      RegisterLocalUserCommand,
      AuthSession
    >(new RegisterLocalUserCommand(body.email, body.password));
    const { refreshToken, refreshTokenExpiresAt } = session;

    this.setRefreshTokenCookie(res, refreshToken, refreshTokenExpiresAt);

    return this.toLoginResponsePayload(session, refreshTokenExpiresAt);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto })
  async login(
    @Body() _credentials: LoginDto,
    @Req() req: LocalAuthRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponsePayload> {
    const session = await this.commandBus.execute<LoginCommand, AuthSession>(
      new LoginCommand(req.user),
    );
    const { refreshToken, refreshTokenExpiresAt } = session;

    this.setRefreshTokenCookie(res, refreshToken, refreshTokenExpiresAt);

    return this.toLoginResponsePayload(session, refreshTokenExpiresAt);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token ile yeni access token uret' })
  @ApiOkResponse({ type: LoginResponseDto })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponsePayload> {
    const refreshToken = this.extractRefreshToken(req);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token bulunamadi');
    }

    const session = await this.commandBus.execute<
      RefreshTokensCommand,
      AuthSession
    >(new RefreshTokensCommand(refreshToken));
    const { refreshToken: newRefreshToken, refreshTokenExpiresAt } = session;

    this.setRefreshTokenCookie(res, newRefreshToken, refreshTokenExpiresAt);

    return this.toLoginResponsePayload(session, refreshTokenExpiresAt);
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Refresh tokeni iptal et' })
  @ApiNoContentResponse({ description: 'Refresh token basariyla iptal edildi' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const refreshToken = this.extractRefreshToken(req);
    this.clearRefreshTokenCookie(res);

    if (refreshToken) {
      await this.commandBus.execute(new LogoutCommand(refreshToken));
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: AuthenticatedUserDto })
  async profile(@CurrentUser() user: AuthenticatedUser) {
    return this.queryBus.execute<GetProfileQuery, AuthenticatedUser>(
      new GetProfileQuery(user.id),
    );
  }

  @Get('edevlet')
  @UseGuards(AuthGuard('edevlet'))
  @ApiOperation({ summary: 'Kullaniciyi E-Devlet girisine yonlendir' })
  redirectToEdevlet() {
    return;
  }

  @Get('edevlet/callback')
  @UseGuards(AuthGuard('edevlet'))
  @ApiOkResponse({ type: LoginResponseDto })
  handleEdevletCallback(@Req() req: LocalAuthRequest) {
    return this.commandBus.execute<LoginCommand, AuthSession>(
      new LoginCommand(req.user),
    );
  }
}
