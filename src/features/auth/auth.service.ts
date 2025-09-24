import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import {
  RoleSummary,
  UsersService,
  UserWithRolePermissions,
} from '../user/services/user.service';

export interface AuthenticatedUser {
  id: string;
  email: string;
  isActive: boolean;
  roles: RoleSummary[];
  permissions: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

  async login(user: AuthenticatedUser): Promise<{
    accessToken: string;
    tokenType: string;
    user: AuthenticatedUser;
  }> {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((role) => role.name),
      permissions: user.permissions,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      user,
    };
  }

  async getProfile(userId: string): Promise<AuthenticatedUser> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    return this.toAuthenticatedUser(user);
  }
}
