import { isAxiosError } from 'axios';

import {
  loginSchema,
  type LoginSchema,
} from '@/features/auth/schemas/login-schema';
import { httpClient } from '@/lib/services/http';

type RoleSummary = {
  id: string;
  name: string;
};

type AuthenticatedUserSummary = {
  id: string;
  email: string;
  isActive: boolean;
  roles: RoleSummary[];
  permissions: string[];
};

export interface LoginSuccessResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshTokenExpiresAt?: string;
  user: AuthenticatedUserSummary;
}

export async function loginWithCredentials(
  payload: LoginSchema,
): Promise<LoginSuccessResponse> {
  const parsed = loginSchema.parse(payload);

  try {
    const { data } = await httpClient.post<LoginSuccessResponse>(
      '/auth/login',
      {
        email: parsed.email,
        password: parsed.password,
      },
    );

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      let responseMessage: string | undefined;

      const responseData = error.response?.data as
        | Partial<{ message: unknown }>
        | undefined;
      const messageCandidate = responseData?.message;

      if (typeof messageCandidate === 'string' && messageCandidate.trim()) {
        responseMessage = messageCandidate;
      }

      throw new Error(
        responseMessage ??
          error.message ??
          'Giris sirasinda beklenmeyen bir hata olustu.',
      );
    }

    throw new Error('Giris sirasinda beklenmeyen bir hata olustu.');
  }
}
