import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';

type UserRoleWithRoleAndPermissions = Prisma.UserRoleGetPayload<{
  include: {
    role: {
      include: {
        rolePermissions: {
          include: {
            permission: true;
          };
        };
      };
    };
  };
}>;

export type UserWithRolePermissions = User & {
  userRoles: UserRoleWithRoleAndPermissions[];
};

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
      include: {
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
      },
    });
  }

  async findById(id: string): Promise<UserWithRolePermissions | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
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
      },
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
