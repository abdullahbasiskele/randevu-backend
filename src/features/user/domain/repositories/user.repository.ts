import type { UserAggregate, UserSummary } from '../models/user.model';

export interface OAuthProviderLink {
  provider: string;
  providerUserId: string;
}

export interface CreateOAuthUserInput extends OAuthProviderLink {
  email: string;
  roles?: string[];
  isActive?: boolean;
}

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<UserAggregate | null>;
  abstract findById(id: string): Promise<UserAggregate | null>;
  abstract findByAuthProvider(
    link: OAuthProviderLink,
  ): Promise<UserAggregate | null>;
  abstract linkAuthProvider(
    userId: string,
    link: OAuthProviderLink,
  ): Promise<void>;
  abstract createOAuthUser(input: CreateOAuthUserInput): Promise<UserAggregate>;
  abstract findAllSummaries(): Promise<UserSummary[]>;
}
