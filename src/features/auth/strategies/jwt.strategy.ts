import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { AuthService, AuthenticatedUser } from '../auth.service';

interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'supersecret',
      audience: process.env.JWT_AUDIENCE ?? 'randevu-clients',
      issuer: process.env.JWT_ISSUER ?? 'randevu-backend',
    };

    super(options);
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.authService.getProfile(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Kullanıcı yetkili değil');
    }

    return user;
  }
}
