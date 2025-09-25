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
import { AuthService } from './auth.service';
import type { AuthenticatedUser, AuthTokens } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import {
  AuthenticatedUserDto,
  LoginDto,
  LoginResponseDto,
} from './dtos/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

type LocalAuthRequest = Request & { user: AuthenticatedUser };

type LoginResponsePayload = AuthTokens & {
  refreshTokenExpiresAt: string;
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly refreshTokenCookieName = 'refresh_token';

  constructor(private readonly authService: AuthService) {}

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

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto })
  async login(
    @Body() _credentials: LoginDto,
    @Req() req: LocalAuthRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponsePayload> {
    const session = await this.authService.login(req.user);
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

    const session = await this.authService.refreshTokens(refreshToken);
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
      await this.authService.logout(refreshToken);
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: AuthenticatedUserDto })
  async profile(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getProfile(user.id);
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
    return this.authService.login(req.user);
  }
}
