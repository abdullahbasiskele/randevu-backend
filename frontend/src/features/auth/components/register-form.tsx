'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Sparkles,
  UserPlus,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { registerWithCredentials } from '@/features/auth/actions/register';
import {
  registerSchema,
  type RegisterSchema,
} from '@/features/auth/schemas/register-schema';
import { resolvePostLoginRoute } from '@/features/auth/config/role-routing';
import { cn } from '@/lib/utils';

interface RegisterFormProps {
  className?: string;
}

export function RegisterForm({ className }: RegisterFormProps = {}) {
  const router = useRouter();
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      acceptPolicies: false,
    },
  });

  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const togglePasswordVisibility = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = React.useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const onSubmit = React.useCallback(
    async (values: RegisterSchema) => {
      setError(null);
      try {
        const response = await registerWithCredentials(values);
        const redirectPath = resolvePostLoginRoute(
          response.user.roles.map((role) => role.name),
        );
        router.replace(redirectPath);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Kayıt sırasında beklenmeyen bir hata oluştu.';
        setError(message);
      }
    },
    [router],
  );

  return (
    <Card
      className={cn(
        'border-none bg-white/85 shadow-lg shadow-primary/10 backdrop-blur-sm',
        className,
      )}
    >
      <CardHeader className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <UserPlus className="h-4 w-4" />
          Yeni Hesap Aç
        </div>
        <div className="space-y-1.5">
          <CardTitle>Kurumsal Randevu Ağına Katıl</CardTitle>
          <CardDescription>
            Güvenli kimlik doğrulama ve yetki kontrollü erişimle kurum
            hizmetlerine dakikalar içinde dahil ol.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <Form {...form}>
          <form
            onSubmit={(event) => {
              void form.handleSubmit(onSubmit)(event);
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="email"
                        placeholder="ornek@randevu.gov.tr"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parola</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="En az 6 karakter"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-1 right-1 h-9 w-9 text-muted-foreground"
                        onClick={togglePasswordVisibility}
                        aria-label={
                          showPassword ? 'Parolayı gizle' : 'Parolayı göster'
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormDescription>
                      En az bir büyük harf ve rakam içeren güçlü bir parola
                      oluşturmanı öneririz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parola doğrulama</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="Parolanızı tekrar yazın"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-1 right-1 h-9 w-9 text-muted-foreground"
                        onClick={toggleConfirmPasswordVisibility}
                        aria-label={
                          showConfirmPassword
                            ? 'Parola doğrulamayı gizle'
                            : 'Parola doğrulamayı göster'
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="acceptPolicies"
              render={({ field }) => (
                <FormItem className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-semibold text-foreground">
                        Kullanım koşulları
                      </Label>
                      <FormDescription className="text-xs leading-relaxed text-muted-foreground">
                        KVKK ve bilgi güvenliği protokollerini kabul ederek
                        randevu platformunu kullanmayı onaylarsın.
                      </FormDescription>
                      <div className="text-xs text-muted-foreground">
                        Detaylar için{' '}
                        <Link
                          href="/sozlesmeler/kullanim"
                          className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                          kullanım sözleşmesi
                        </Link>{' '}
                        ve{' '}
                        <Link
                          href="/sozlesmeler/kvkk"
                          className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                          KVKK bildirimi
                        </Link>
                        ni inceleyebilirsin.
                      </div>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(event) =>
                          field.onChange(event.target.checked)
                        }
                        className="mt-1 h-5 w-5 rounded border border-input accent-primary"
                        aria-label="Kullanım koşullarını onayla"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                {error}
              </div>
            ) : null}
            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Hesap oluşturuluyor...
                </span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Kayıt Ol
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
        <div className="space-y-3.5">
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              avantajlar
            </span>
            <Separator className="flex-1" />
          </div>
          <div className="grid gap-2.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              OAuth2 ve e-Devlet entegrasyonu ile çok kanallı kimlik doğrulama.
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              CASL tabanlı yetkilendirme ile ekran ve işlem bazlı güvenlik.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-center text-xs text-muted-foreground">
        <p>
          Zaten hesabın var mı?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Oturum aç
          </Link>
        </p>
        <p className="text-muted-foreground/80">
          Destek ekibi:{' '}
          <a
            className="font-medium text-primary"
            href="mailto:destek@randevu.gov.tr"
          >
            destek@randevu.gov.tr
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
