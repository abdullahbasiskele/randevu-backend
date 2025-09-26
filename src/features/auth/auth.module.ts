import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthorizationModule } from './authorization.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { EdevletStrategy } from './strategies/edevlet.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../user/user.module';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';
import { LoginHandler } from './commands/handlers/login.handler';
import { RefreshTokensHandler } from './commands/handlers/refresh-tokens.handler';
import { LogoutHandler } from './commands/handlers/logout.handler';
import { GetProfileHandler } from './queries/handlers/get-profile.handler';

const AUTH_CQRS_HANDLERS = [
  LoginHandler,
  RefreshTokensHandler,
  LogoutHandler,
  GetProfileHandler,
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
  providers: [
    AuthService,
    RefreshTokenService,
    LocalStrategy,
    JwtStrategy,
    EdevletStrategy,
    ...AUTH_CQRS_HANDLERS,
  ],
  exports: [AuthService],
})
export class AuthModule {}
