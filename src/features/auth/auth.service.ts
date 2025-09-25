import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import {
  RoleSummary,
  UsersService,
  UserWithRolePermissions,
} from '../user/services/user.service';
import { RefreshTokenService } from './services/refresh-token.service';

export interface AuthenticatedUser {
  id: string;
  email: string;
  isActive: boolean;
  roles: RoleSummary[];
  permissions: string[];
}

export interface OAuthProfile {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthenticatedUser;
}

export interface AuthSession extends AuthTokens {
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

@Injectable()
export class AuthService {
  private readonly tokenExpiresInSeconds = this.parseExpiresIn();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  private toAuthenticatedUser(
    user: UserWithRolePermissions,
  ): AuthenticatedUser {
    const roles = this.usersService.mapRoles(user);
    const permissions = this.usersService.collectPermissions(user);

    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      roles,
      permissions,
    };
  }

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
      await this.refreshTokenService.generateToken(user.id);

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
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) {
      return null;
    }

    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      return null;
    }

    return this.toAuthenticatedUser(user);
  }

  async login(user: AuthenticatedUser): Promise<AuthSession> {
    return this.buildAuthSession(user);
  }

  async refreshTokens(refreshToken: string): Promise<AuthSession> {
    const storedToken = await this.refreshTokenService
      .resolveToken(refreshToken)
      .catch(() => {
        throw new UnauthorizedException(
          'Gecersiz veya suresi dolmus refresh token',
        );
      });

    const user = await this.usersService.findById(storedToken.userId);
    if (!user || !user.isActive) {
      await this.refreshTokenService.revokeToken(refreshToken);
      throw new UnauthorizedException('Kullanici dogrulanamadi');
    }

    await this.refreshTokenService.revokeToken(refreshToken);

    const authUser = this.toAuthenticatedUser(user);
    return this.buildAuthSession(authUser);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenService.revokeToken(refreshToken);
  }

  async getProfile(userId: string): Promise<AuthenticatedUser> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Kullanici bulunamadi');
    }

    return this.toAuthenticatedUser(user);
  }

  async handleOAuthUser(
    provider: string,
    profile: OAuthProfile,
  ): Promise<AuthenticatedUser> {
    const providerUserId = profile.id;
    let user = await this.usersService.findByAuthProvider(
      provider,
      providerUserId,
    );

    if (!user && profile.email) {
      user = await this.usersService.findByEmail(profile.email);
      if (user) {
        await this.usersService.linkAuthProvider(
          user.id,
          provider,
          providerUserId,
        );
      }
    }

    if (!user) {
      const email =
        profile.email ?? `${providerUserId}@${provider.toLowerCase()}.local`;

      user = await this.usersService.createOAuthUser({
        email,
        provider,
        providerUserId,
      });
    }

    return this.toAuthenticatedUser(user);
  }
}
