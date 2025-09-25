import { Injectable } from '@nestjs/common';
import { AbilityBuilder, AbilityClass } from '@casl/ability';
import { PrismaAbility, createPrismaAbility } from '@casl/prisma';
import { AuthenticatedUser } from '../auth.service';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = 'User' | 'Role' | 'Permission' | 'all';

export type AppAbility = PrismaAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  private readonly abilityClass =
    createPrismaAbility as unknown as AbilityClass<AppAbility>;

  createForUser(user: AuthenticatedUser): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(this.abilityClass);

    const permissionSet = new Set(user.permissions);

    if (permissionSet.has('USER_CREATE')) {
      can(Action.Create, 'User');
    }
    if (permissionSet.has('USER_READ')) {
      can(Action.Read, 'User');
    }
    if (permissionSet.has('USER_UPDATE')) {
      can(Action.Update, 'User');
    }
    if (permissionSet.has('USER_DELETE')) {
      can(Action.Delete, 'User');
    }
    if (permissionSet.has('ROLE_MANAGE')) {
      can(Action.Manage, 'Role');
    }
    if (permissionSet.has('PERMISSION_MANAGE')) {
      can(Action.Manage, 'Permission');
    }

    return build();
  }
}
