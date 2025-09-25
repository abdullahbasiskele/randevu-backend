import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string({
      required_error: 'E-posta ya da T.C. kimlik numaras� zorunludur.',
    })
    .min(4, 'En az 4 karakter giriniz.'),
  password: z
    .string({ required_error: 'Parola zorunludur.' })
    .min(6, 'Parolan�z en az 6 karakter olmal�d�r.'),
  rememberMe: z.boolean().default(false),
});

export type LoginSchema = z.infer<typeof loginSchema>;
