export interface RefreshTokenRecord {
  id: string;
  userId: string;
  expiresAt: Date;
}

export abstract class RefreshTokenRepository {
  abstract generate(
    userId: string,
  ): Promise<{ token: string; expiresAt: Date }>;
  abstract findValid(token: string): Promise<RefreshTokenRecord | null>;
  abstract revoke(token: string): Promise<void>;
  abstract revokeByUser(userId: string): Promise<void>;
}
