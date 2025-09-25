import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'E-posta adresi zorunludur.' })
    .min(4, 'En az 4 karakter giriniz.'),
  password: z
    .string({ required_error: 'Parola zorunludur.' })
    .min(6, 'Parolanız en az 6 karakter olmalıdır.'),
  rememberMe: z.boolean().default(false),
});

export type LoginSchema = z.infer<typeof loginSchema>;
