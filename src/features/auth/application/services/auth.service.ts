import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import type {
  AuthenticatedUser,
  AuthSession,
  OAuthProfile,
} from '../../domain/models/auth.types';
import {
  UserRepository,
  type CreateOAuthUserInput,
  type OAuthProviderLink,
} from '../../../user/domain/repositories/user.repository';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import type { UserAggregate } from '../../../user/domain/models/user.model';

@Injectable()
export class AuthService {
  private readonly tokenExpiresInSeconds = this.parseExpiresIn();

  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  private parseExpiresIn(): number {
    const expires = process.env.JWT_EXPIRES ?? '1d';
    if (/^\d+$/.test(expires)) {
      return Number(expires);
    }

    const match = expires.match(/^(\d+)([smhd])$/i);
    if (!match) {
      return 3600;
    }

    const value = Number(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 3600;
    }
  }

  private mapToAuthenticatedUser(user: UserAggregate): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      roles: user.roles.map((role) => ({
        id: role.id,
        name: role.name,
      })),
      permissions: user.permissions,
    };
  }

  private async buildAuthSession(
    user: AuthenticatedUser,
  ): Promise<AuthSession> {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((role) => role.name),
      permissions: user.permissions,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const { token: refreshToken, expiresAt: refreshTokenExpiresAt } =
      await this.refreshTokenRepository.generate(user.id);

    return {
      accessToken,
      refreshToken,
      refreshTokenExpiresAt,
      tokenType: 'Bearer',
      expiresIn: this.tokenExpiresInSeconds,
      user,
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.isActive) {
      return null;
    }

    const passwordMatches = await compare(password, user.passwordHash);
    if (!passwordMatches) {
      return null;
    }

    return this.mapToAuthenticatedUser(user);
  }

  async login(user: AuthenticatedUser): Promise<AuthSession> {
    return this.buildAuthSession(user);
  }

  async refreshTokens(refreshToken: string): Promise<AuthSession> {
    const storedToken =
      await this.refreshTokenRepository.findValid(refreshToken);
    if (!storedToken) {
      throw new UnauthorizedException(
        'Gecersiz veya suresi dolmus refresh token',
      );
    }

    const user = await this.userRepository.findById(storedToken.userId);
    if (!user || !user.isActive) {
      await this.refreshTokenRepository.revoke(refreshToken);
      throw new UnauthorizedException('Kullanici dogrulanamadi');
    }

    await this.refreshTokenRepository.revoke(refreshToken);

    const authUser = this.mapToAuthenticatedUser(user);
    return this.buildAuthSession(authUser);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.revoke(refreshToken);
  }

  async getProfile(userId: string): Promise<AuthenticatedUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Kullanici bulunamadi');
    }

    return this.mapToAuthenticatedUser(user);
  }

  async handleOAuthUser(
    provider: string,
    profile: OAuthProfile,
  ): Promise<AuthenticatedUser> {
    const link: OAuthProviderLink = {
      provider,
      providerUserId: profile.id,
    };

    let user = await this.userRepository.findByAuthProvider(link);

    if (!user && profile.email) {
      user = await this.userRepository.findByEmail(profile.email);
      if (user) {
        await this.userRepository.linkAuthProvider(user.id, link);
      }
    }

    if (!user) {
      const email =
        profile.email ?? `${profile.id}@${provider.toLowerCase()}.local`;
      const input: CreateOAuthUserInput = {
        email,
        provider,
        providerUserId: profile.id,
      };
      user = await this.userRepository.createOAuthUser(input);
    }

    return this.mapToAuthenticatedUser(user);
  }
}
