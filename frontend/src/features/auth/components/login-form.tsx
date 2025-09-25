'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Waves,
  LogIn,
} from 'lucide-react';
import { useForm } from 'react-hook-form';

import Link from 'next/link';

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
import {
  loginSchema,
  type LoginSchema,
} from '@/features/auth/schemas/login-schema';
import { loginWithCredentials } from '@/features/auth/actions/login';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  className?: string;
}

export function LoginForm({ className }: LoginFormProps) {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
  });

  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const handlePasswordToggle = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = React.useCallback(async (values: LoginSchema) => {
    setError(null);
    try {
      await loginWithCredentials(values);
      // TODO: navigation to dashboard or profile can be handled by caller.
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Giriş sırasında beklenmeyen bir hata oluştu.';
      setError(message);
    }
  }, []);

  return (
    <Card
      className={cn(
        'border-none bg-white/80 shadow-lg shadow-primary/10 backdrop-blur-sm',
        className,
      )}
    >
      <CardHeader className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <ShieldCheck className="h-4 w-4" />
          Güvenli Giriş Katmanı
        </div>
        <div className="space-y-1.5">
          <CardTitle>Randevu Platformuna Hoş Geldin</CardTitle>
          <CardDescription>
            Belediye uygulamalarına tek oturumla eriş, yetkilerin doğrulansın ve
            oturumun otomatik yenilensin.
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
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta ya da T.C. Kimlik No</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="username"
                        placeholder="ornek@randevu.gov.tr"
                      />
                    </FormControl>
                    <FormDescription>
                      LDAP kullanıcı adın, belediye mail adresin veya e-Devlet
                      kimliğin ile giriş yapabilirsin.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Parola</FormLabel>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-sm"
                        asChild
                      >
                        <Link href="/auth/reset" className="text-primary">
                          Parolamı unuttum
                        </Link>
                      </Button>
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="pr-12"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-1 right-1 h-9 w-9 text-muted-foreground"
                        onClick={handlePasswordToggle}
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
                      Şifreler AES-256 ile şifrelenmiş olarak saklanır. Ortak
                      cihazlarda otomatik çıkışı açık bırak.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="rounded-xl border border-border/60 bg-muted/20 px-4 py-2.5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm font-semibold text-foreground">
                        Beni hatırla
                      </Label>
                      <FormDescription className="max-w-xs">
                        Kişisel cihazlarda önerilir. Güvenilmeyen ortamlarda
                        devre dışı bırak.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(event) =>
                          field.onChange(event.target.checked)
                        }
                        className="h-5 w-5 rounded border border-input accent-primary"
                        aria-label="Beni hatırla"
                      />
                    </FormControl>
                  </div>
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
                  Oturum açılıyor...
                </span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Oturum Aç
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
              ya da
            </span>
            <Separator className="flex-1" />
          </div>
          <div className="grid gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full gap-3 border-dashed"
            >
              <ShieldCheck className="h-4 w-4" />
              E-Devlet ile Giriş Yap
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="w-full gap-3 text-muted-foreground"
            >
              <Waves className="h-4 w-4" />
              Kurumsal Tek Oturum Açma (SSO)
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-1.5 text-center text-xs text-muted-foreground">
        <p>
          Giriş yaparak KVKK metnini ve yetki kullanım politikalarını kabul
          etmiş olursun.
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
