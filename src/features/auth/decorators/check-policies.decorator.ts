import { SetMetadata } from '@nestjs/common';
import type { PolicyHandlerLike } from '../guards/policies.guard';

export const CHECK_POLICIES_KEY = 'check_policies';

export const CheckPolicies = (...handlers: PolicyHandlerLike[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
