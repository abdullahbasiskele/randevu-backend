import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { AuthenticatedUser } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import {
  AuthenticatedUserDto,
  LoginDto,
  LoginResponseDto,
} from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

type LocalAuthRequest = Request & { user: AuthenticatedUser };

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() _credentials: LoginDto, @Req() req: LocalAuthRequest) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token ile yeni access token uret' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: LoginResponseDto })
  async refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refreshTokens(body.refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Refresh tokeni iptal et' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiNoContentResponse({ description: 'Refresh token basariyla iptal edildi' })
  async logout(@Body() body: RefreshTokenDto): Promise<void> {
    await this.authService.logout(body.refreshToken);
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
