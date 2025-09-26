import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import {
  RefreshTokenRepository,
  type RefreshTokenRecord,
} from '../../domain/repositories/refresh-token.repository';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

const DEFAULT_TOKEN_LENGTH = Number(process.env.REFRESH_TOKEN_LENGTH ?? 64);
const DEFAULT_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 7);

@Injectable()
export class PrismaRefreshTokenRepository extends RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async generate(userId: string): Promise<{ token: string; expiresAt: Date }> {
    const token = randomBytes(Math.ceil(DEFAULT_TOKEN_LENGTH / 2))
      .toString('hex')
      .slice(0, DEFAULT_TOKEN_LENGTH);
    const tokenHash = this.hash(token);
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

  async findValid(token: string): Promise<RefreshTokenRecord | null> {
    const tokenHash = this.hash(token);

    const record = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!record) {
      return null;
    }

    return {
      id: record.id,
      userId: record.userId,
      expiresAt: record.expiresAt,
    };
  }

  async revoke(token: string): Promise<void> {
    const tokenHash = this.hash(token);

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

  async revokeByUser(userId: string): Promise<void> {
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

  private hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private calculateExpiry(): Date {
    const expires = new Date();
    expires.setDate(expires.getDate() + DEFAULT_TTL_DAYS);
    return expires;
  }
}
