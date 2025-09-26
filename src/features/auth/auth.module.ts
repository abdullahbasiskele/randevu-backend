import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthorizationModule } from './authorization.module';
import { AuthController } from './auth.controller';
import { AuthService } from './application/services/auth.service';
import { EdevletStrategy } from './strategies/edevlet.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../user/user.module';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';
import { LoginHandler } from './application/commands/handlers/login.handler';
import { RefreshTokensHandler } from './application/commands/handlers/refresh-tokens.handler';
import { LogoutHandler } from './application/commands/handlers/logout.handler';
import { GetProfileHandler } from './application/queries/handlers/get-profile.handler';
import { RefreshTokenRepository } from './domain/repositories/refresh-token.repository';
import { PrismaRefreshTokenRepository } from './infrastructure/persistence/prisma-refresh-token.repository';

const AUTH_CQRS_HANDLERS = [
  LoginHandler,
  RefreshTokensHandler,
  LogoutHandler,
  GetProfileHandler,
];

const AUTH_PROVIDERS = [
  AuthService,
  {
    provide: RefreshTokenRepository,
    useClass: PrismaRefreshTokenRepository,
  },
  LocalStrategy,
  JwtStrategy,
  EdevletStrategy,
  ...AUTH_CQRS_HANDLERS,
];

@Module({
  imports: [
    UsersModule,
    AuthorizationModule,
    PrismaModule,
    PassportModule,
    CqrsModule,
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
  providers: AUTH_PROVIDERS,
  exports: [AuthService],
})
export class AuthModule {}
