import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import axios from 'axios';
import type {
  AuthenticatedUser,
  OAuthProfile,
} from '../domain/models/auth.types';
import { AuthService } from '../application/services/auth.service';

interface OAuthUserInfo {
  sub?: string;
  id?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  firstName?: string;
  lastName?: string;
}

@Injectable()
export class EdevletStrategy extends PassportStrategy(Strategy, 'edevlet') {
  private readonly userInfoURL?: string;

  constructor(private readonly authService: AuthService) {
    const authorizationURL = process.env.EDEVLET_AUTH_URL;
    const tokenURL = process.env.EDEVLET_TOKEN_URL;
    const clientID = process.env.EDEVLET_CLIENT_ID;
    const clientSecret = process.env.EDEVLET_CLIENT_SECRET;
    const callbackURL = process.env.EDEVLET_CALLBACK_URL;

    if (
      !authorizationURL ||
      !tokenURL ||
      !clientID ||
      !clientSecret ||
      !callbackURL
    ) {
      throw new Error(
        'E-Devlet OAuth ayarlari eksik. Lutfen cevre degiskenlerini kontrol edin.',
      );
    }

    super({
      authorizationURL,
      tokenURL,
      clientID,
      clientSecret,
      callbackURL,
      scope: EdevletStrategy.parseScope(),
      state: true,
    });

    this.userInfoURL = process.env.EDEVLET_USERINFO_URL ?? undefined;
  }

  private static parseScope(): string[] {
    const scope = process.env.EDEVLET_SCOPE;
    if (!scope) {
      return ['openid'];
    }

    return scope.split(/[\s,]+/).filter(Boolean);
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    _params: Record<string, unknown>,
    profile: Record<string, unknown>,
  ): Promise<AuthenticatedUser> {
    const userProfile = await this.fetchUserProfile(accessToken, profile);
    return this.authService.handleOAuthUser('EDEVLET', userProfile);
  }

  private async fetchUserProfile(
    accessToken: string,
    profile: Record<string, unknown>,
  ): Promise<OAuthProfile> {
    if (this.userInfoURL) {
      try {
        const response = await axios.get<OAuthUserInfo>(this.userInfoURL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = response.data ?? {};
        const identifier =
          data.sub ??
          data.id ??
          (typeof profile.id === 'string' ? profile.id : undefined) ??
          (typeof profile.sub === 'string' ? profile.sub : undefined);

        if (!identifier) {
          throw new UnauthorizedException('E-Devlet kimlik bilgisi alinmadi');
        }

        return {
          id: identifier,
          email:
            data.email ??
            (typeof profile.email === 'string' ? profile.email : undefined),
          firstName:
            data.given_name ??
            data.firstName ??
            (typeof profile.given_name === 'string'
              ? profile.given_name
              : undefined) ??
            (typeof profile.firstName === 'string'
              ? profile.firstName
              : undefined),
          lastName:
            data.family_name ??
            data.lastName ??
            (typeof profile.family_name === 'string'
              ? profile.family_name
              : undefined) ??
            (typeof profile.lastName === 'string'
              ? profile.lastName
              : undefined),
        };
      } catch {
        throw new UnauthorizedException('E-Devlet kullanici bilgisi alinmadi');
      }
    }

    const identifier =
      (typeof profile.id === 'string' ? profile.id : undefined) ??
      (typeof profile.sub === 'string' ? profile.sub : undefined);
    if (!identifier) {
      throw new UnauthorizedException('E-Devlet kimlik bilgisi alinmadi');
    }

    return {
      id: identifier,
      email: typeof profile.email === 'string' ? profile.email : undefined,
      firstName:
        (typeof profile.given_name === 'string'
          ? profile.given_name
          : undefined) ??
        (typeof profile.firstName === 'string' ? profile.firstName : undefined),
      lastName:
        (typeof profile.family_name === 'string'
          ? profile.family_name
          : undefined) ??
        (typeof profile.lastName === 'string' ? profile.lastName : undefined),
    };
  }
}
