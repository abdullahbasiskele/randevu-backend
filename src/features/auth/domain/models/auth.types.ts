export interface RoleSummary {
  id: string;
  name: string;
}

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
