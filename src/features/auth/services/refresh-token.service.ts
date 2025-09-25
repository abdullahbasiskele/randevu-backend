import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomBytes, createHash } from 'crypto';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';

const DEFAULT_TOKEN_LENGTH = Number(process.env.REFRESH_TOKEN_LENGTH ?? 64);
const DEFAULT_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 7);
const REFRESH_TOKEN_WITH_USER = {
  include: {
    user: true,
  },
} as const;

type RefreshTokenWithUser = Prisma.RefreshTokenGetPayload<
  typeof REFRESH_TOKEN_WITH_USER
>;

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async generateToken(
    userId: string,
  ): Promise<{ token: string; expiresAt: Date }> {
    const token = randomBytes(Math.ceil(DEFAULT_TOKEN_LENGTH / 2))
      .toString('hex')
      .slice(0, DEFAULT_TOKEN_LENGTH);
    const tokenHash = this.hashToken(token);
    const expiresAt = this.calculateExpiry();

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return { token, expiresAt };
  }

  async resolveToken(token: string): Promise<RefreshTokenWithUser> {
    const tokenHash = this.hashToken(token);

    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      ...REFRESH_TOKEN_WITH_USER,
    });

    if (!storedToken) {
      throw new Error('REFRESH_TOKEN_INVALID');
    }

    return storedToken;
  }

  async revokeToken(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);

    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async revokeUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  private calculateExpiry(): Date {
    const expires = new Date();
    expires.setDate(expires.getDate() + DEFAULT_TTL_DAYS);
    return expires;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
