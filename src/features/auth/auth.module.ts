import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthorizationModule } from './authorization.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { EdevletStrategy } from './strategies/edevlet.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../user/user.module';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

@Module({
  imports: [
    UsersModule,
    AuthorizationModule,
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'supersecret',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES ?? '1d',
        audience: process.env.JWT_AUDIENCE ?? 'randevu-clients',
        issuer: process.env.JWT_ISSUER ?? 'randevu-backend',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshTokenService,
    LocalStrategy,
    JwtStrategy,
    EdevletStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
