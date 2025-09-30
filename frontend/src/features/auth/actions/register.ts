import { isAxiosError } from 'axios';

import type { LoginSuccessResponse } from '@/features/auth/actions/login';
import {
  registerSchema,
  type RegisterSchema,
} from '@/features/auth/schemas/register-schema';
import { httpClient } from '@/lib/services/http';

export async function registerWithCredentials(
  payload: RegisterSchema,
): Promise<LoginSuccessResponse> {
  const parsed = registerSchema.parse(payload);

  try {
    const { data } = await httpClient.post<LoginSuccessResponse>(
      '/auth/register',
      {
        email: parsed.email,
        password: parsed.password,
      },
    );

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const responseData = error.response?.data as
        | Partial<{ message: unknown }>
        | undefined;
      const messageCandidate = responseData?.message;
      const fallback =
        error.message ?? 'Kayit sirasinda beklenmeyen bir hata olustu.';

      if (typeof messageCandidate === 'string' && messageCandidate.trim()) {
        throw new Error(messageCandidate);
      }

      throw new Error(fallback);
    }

    throw new Error('Kayit sirasinda beklenmeyen bir hata olustu.');
  }
}
