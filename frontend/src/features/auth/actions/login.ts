import { isAxiosError } from 'axios';

import {
  loginSchema,
  type LoginSchema,
} from '@/features/auth/schemas/login-schema';
import { httpClient } from '@/lib/services/http';

export interface LoginSuccessResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function loginWithCredentials(
  payload: LoginSchema,
): Promise<LoginSuccessResponse> {
  const parsed = loginSchema.parse(payload);

  try {
    const { data } = await httpClient.post<LoginSuccessResponse>(
      '/auth/login',
      {
        identifier: parsed.identifier,
        password: parsed.password,
        rememberMe: parsed.rememberMe,
      },
    );

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      let responseMessage: string | undefined;

      if (typeof error.response?.data === 'object' && error.response?.data) {
        const messageCandidate = (error.response.data as { message?: unknown })
          .message;

        if (
          typeof messageCandidate === 'string' &&
          messageCandidate.trim().length > 0
        ) {
          responseMessage = messageCandidate;
        }
      }

      throw new Error(
        responseMessage ??
          error.message ??
          'Giriş sırasında beklenmeyen bir hata oluştu.',
      );
    }

    throw new Error('Giriş sırasında beklenmeyen bir hata oluştu.');
  }
}
