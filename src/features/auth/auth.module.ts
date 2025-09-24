import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthorizationModule } from './authorization.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [
    UsersModule,
    AuthorizationModule,
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
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
