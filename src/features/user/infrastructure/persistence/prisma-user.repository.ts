import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import { hash } from 'bcryptjs';
import {
  UserRepository,
  type CreateOAuthUserInput,
  type OAuthProviderLink,
} from '../../domain/repositories/user.repository';
import type {
  UserAggregate,
  UserRoleModel,
  UserSummary,
} from '../../domain/models/user.model';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

const USER_WITH_RELATIONS = {
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
} as const;

type PrismaUserWithRelations = Prisma.UserGetPayload<{
  include: typeof USER_WITH_RELATIONS;
}>;

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByEmail(email: string): Promise<UserAggregate | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: USER_WITH_RELATIONS,
    });

    return user ? this.toAggregate(user) : null;
  }

  async findById(id: string): Promise<UserAggregate | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: USER_WITH_RELATIONS,
    });

    return user ? this.toAggregate(user) : null;
  }

  async findByAuthProvider(
    link: OAuthProviderLink,
  ): Promise<UserAggregate | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        authProviders: {
          some: {
            provider: link.provider,
            providerUserId: link.providerUserId,
          },
        },
      },
      include: USER_WITH_RELATIONS,
    });

    return user ? this.toAggregate(user) : null;
  }

  async linkAuthProvider(
    userId: string,
    link: OAuthProviderLink,
  ): Promise<void> {
    await this.prisma.authProvider.upsert({
      where: {
        provider_providerUserId: {
          provider: link.provider,
          providerUserId: link.providerUserId,
        },
      },
      create: {
        provider: link.provider,
        providerUserId: link.providerUserId,
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

  async createOAuthUser(input: CreateOAuthUserInput): Promise<UserAggregate> {
    const roles =
      input.roles && input.roles.length > 0 ? input.roles : ['USER'];
    const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS ?? 12);
    const randomPassword = randomBytes(32).toString('hex');
    const passwordHash = await hash(randomPassword, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        password: passwordHash,
        isActive: input.isActive ?? true,
        userRoles: {
          create: roles.map((roleName) => ({
            role: {
              connect: { name: roleName },
            },
          })),
        },
        authProviders: {
          create: {
            provider: input.provider,
            providerUserId: input.providerUserId,
          },
        },
      },
      include: USER_WITH_RELATIONS,
    });

    return this.toAggregate(user);
  }

  async findAllSummaries(): Promise<UserSummary[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      isActive: user.isActive,
    }));
  }

  private toAggregate(user: PrismaUserWithRelations): UserAggregate {
    const roles: UserRoleModel[] = user.userRoles.map(({ role }) => ({
      id: role.id,
      name: role.name,
      permissions: role.rolePermissions.map((rp) => rp.permission.name),
    }));

    const permissions = new Set<string>();
    for (const role of roles) {
      for (const permission of role.permissions) {
        permissions.add(permission);
      }
    }

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.password,
      isActive: user.isActive,
      roles,
      permissions: Array.from(permissions),
    };
  }
}
