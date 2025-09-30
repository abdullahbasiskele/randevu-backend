import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z
      .string({ required_error: 'E-posta adresi zorunludur.' })
      .email('Gecerli bir e-posta adresi giriniz.'),
    password: z
      .string({ required_error: 'Parola zorunludur.' })
      .min(6, 'Parolaniz en az 6 karakter olmalidir.'),
    confirmPassword: z
      .string({ required_error: 'Parola dogrulamasi zorunludur.' })
      .min(6, 'Parola dogrulamasi en az 6 karakter olmalidir.'),
    acceptPolicies: z.boolean().refine((value) => value, {
      message: 'Kullanim kosullarini onaylamaniz gerekir.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Parolalar eslesmiyor.',
    path: ['confirmPassword'],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
