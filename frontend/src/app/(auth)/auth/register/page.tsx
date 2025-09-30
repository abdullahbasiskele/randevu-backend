import { ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

import { RegisterForm } from '@/features/auth/components/register-form';

const highlights = [
  {
    title: 'Sıfırdan Yetki Ağları',
    description:
      'Rol tabanlı izleme, izin tanımlama ve CASL destekli arayüz korumaları ile kontrol sende.',
    icon: ShieldCheck,
  },
  {
    title: 'Modern Kimlik Katmanı',
    description:
      'OAuth2, e-Devlet ve JWT refresh token altyapısı ile güvenli bağlantı.',
    icon: Sparkles,
  },
  {
    title: 'Operasyonel Şeffaflık',
    description:
      'Login sonrası rota yönetimi ve audit yapıları ile hızlı takip.',
    icon: UserCheck,
  },
] as const;

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-svh items-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1d4ed8_0%,_rgba(15,23,42,0.95)_55%,_rgba(15,23,42,1)_100%)]" />
      <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/25 blur-[180px]" />
      <div className="absolute bottom-0 left-0 right-0 hidden h-48 bg-gradient-to-t from-slate-900/80 to-transparent lg:block" />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl items-center px-6 lg:px-10">
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/60 p-10 shadow-[0_40px_80px_-30px_rgba(15,15,70,0.7)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-teal-500/10" />
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Yeni Hesap Deneyimi
              </div>
              <div className="space-y-3 text-white">
                <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
                  Belediyenin dijital hizmetlerine kolayca katıl.
                </h1>
                <p className="text-base text-slate-300 lg:text-lg">
                  Yetki zinciri, audit kayıtları ve modern kimlik
                  entegrasyonları ile güvenli bir operasyon merkezi tasarladık.
                </p>
              </div>
              <div className="grid gap-6">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="group flex items-start gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-300/90">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs uppercase tracking-[0.45em] text-slate-500">
                KAYIT - GÜVENLİK - YETKİ
              </p>
            </div>
          </section>

          <section className="lg:translate-y-2">
            <RegisterForm />
          </section>
        </div>
      </main>
    </div>
  );
}
