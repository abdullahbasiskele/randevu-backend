import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';
import { hash } from 'bcryptjs';
import { randomBytes } from 'crypto';

const AUTH_USER_INCLUDE = {
  userRoles: {
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  },
  authProviders: true,
} satisfies Prisma.UserInclude;

export type UserWithRolePermissions = Prisma.UserGetPayload<{
  include: typeof AUTH_USER_INCLUDE;
}>;

export interface RoleSummary {
  id: string;
  name: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserWithRolePermissions | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: AUTH_USER_INCLUDE,
    });
  }

  async findById(id: string): Promise<UserWithRolePermissions | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: AUTH_USER_INCLUDE,
    });
  }

  async findByAuthProvider(
    provider: string,
    providerUserId: string,
  ): Promise<UserWithRolePermissions | null> {
    return this.prisma.user.findFirst({
      where: {
        authProviders: {
          some: {
            provider,
            providerUserId,
          },
        },
      },
      include: AUTH_USER_INCLUDE,
    });
  }

  async linkAuthProvider(
    userId: string,
    provider: string,
    providerUserId: string,
  ): Promise<void> {
    await this.prisma.authProvider.upsert({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId,
        },
      },
      create: {
        provider,
        providerUserId,
        user: {
          connect: { id: userId },
        },
      },
      update: {
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async createOAuthUser(options: {
    email: string;
    provider: string;
    providerUserId: string;
    roles?: string[];
    isActive?: boolean;
  }): Promise<UserWithRolePermissions> {
    const roles =
      options.roles && options.roles.length > 0 ? options.roles : ['USER'];
    const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS ?? 12);
    const randomPassword = randomBytes(32).toString('hex');
    const passwordHash = await hash(randomPassword, saltRounds);

    return this.prisma.user.create({
      data: {
        email: options.email,
        password: passwordHash,
        isActive: options.isActive ?? true,
        userRoles: {
          create: roles.map((roleName) => ({
            role: {
              connect: {
                name: roleName,
              },
            },
          })),
        },
        authProviders: {
          create: {
            provider: options.provider,
            providerUserId: options.providerUserId,
          },
        },
      },
      include: AUTH_USER_INCLUDE,
    });
  }

  mapRoles(user: UserWithRolePermissions): RoleSummary[] {
    return user.userRoles.map(({ role }) => ({ id: role.id, name: role.name }));
  }

  collectPermissions(user: UserWithRolePermissions): string[] {
    const permissions = new Set<string>();

    for (const { role } of user.userRoles) {
      for (const rolePermission of role.rolePermissions) {
        permissions.add(rolePermission.permission.name);
      }
    }

    return Array.from(permissions);
  }

  async findAllBasic(): Promise<
    Array<Pick<User, 'id' | 'email' | 'isActive'>>
  > {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });
  }
}
