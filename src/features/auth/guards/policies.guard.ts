import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import {
  CaslAbilityFactory,
  AppAbility,
} from '../ability/casl-ability.factory';
import type { AuthenticatedUser } from '../auth.service';

interface PolicyHandler {
  handle(ability: AppAbility): boolean;
}

export type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandlerLike = PolicyHandler | PolicyHandlerCallback;

interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
  ability?: AppAbility;
}

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const handlers = this.reflector.getAllAndOverride<PolicyHandlerLike[]>(
      CHECK_POLICIES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!handlers || handlers.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Kullanıcı doğrulanamadı');
    }

    const ability = this.abilityFactory.createForUser(user);
    request.ability = ability;

    return handlers.every((handler) => this.executeHandler(handler, ability));
  }

  private executeHandler(
    handler: PolicyHandlerLike,
    ability: AppAbility,
  ): boolean {
    if (typeof handler === 'function') {
      return handler(ability);
    }

    return handler.handle(ability);
  }
}
