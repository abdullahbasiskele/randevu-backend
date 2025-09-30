import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck,
  HelpCircle,
  LogIn,
  Settings,
  UserCog,
} from 'lucide-react';

const navigationLinks = [
  {
    title: 'Ana Sayfa',
    description: 'Landing ekranına geri dönerek uygulamanın özetini gör.',
    href: '/',
  },
  {
    title: 'Kullanıcı Girişi',
    description: 'Hesabınla giriş yap ve yetki tabanlı ekranlara ulaş.',
    href: '/auth/login',
  },
  {
    title: 'Yeni Kayıt',
    description: 'Refresh cookie destekli oturumla sisteme hızlıca kaydol.',
    href: '/auth/register',
  },
  {
    title: 'Admin Paneli',
    description: 'Yönetici dashboardu ve denetim işlemlerini buradan aç.',
    href: '/admin/dashboard',
  },
  {
    title: 'Uygulama Ana Sayfası',
    description: 'Feature bazlı dilimlerin kısayollarına yeniden dön.',
    href: '/app/home',
  },
];

const quickActions = [
  {
    title: 'Randevu Oluştur',
    description: 'Vatandaş veya kurum adına hızlıca randevu kaydı aç.',
    icon: CalendarCheck,
  },
  {
    title: 'Profil Bilgilerim',
    description: 'Kişisel iletişim ve yetki tercihlerini güncelle.',
    icon: UserCog,
  },
  {
    title: 'Destek Talebi',
    description: 'Yaşadığın sorunları destek ekibine ilet.',
    icon: HelpCircle,
  },
];

const updates = [
  {
    title: 'Yeni Randevu Modülü',
    content:
      'Sağlık birimleri için randevu önceliklendirme özelliği yayına alındı. Daha hızlı planlama için yeni filtreleri deneyin.',
  },
  {
    title: 'Güvenlik Güncellemesi',
    content:
      'OAuth2 tabanlı giriş sistemi güçlendirildi. E-Devlet ile giriş sırasında ekstra doğrulama katmanı eklendi.',
  },
  {
    title: 'Bildirim Merkezi',
    content:
      'Takvime eklenen randevular ve yönetici duyuruları için bildirim tercihlerinizi özelleştirebilirsiniz.',
  },
];

export default function AppHomePage() {
  return (
    <div className="flex flex-col gap-10 p-8">
      <header className="grid gap-6 rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8 shadow-sm dark:border-slate-800/70 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          <LogIn className="h-4 w-4" /> Hoş Geldiniz
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Randevu Uygulamasına Hoş Geldiniz
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Rolünüze göre tanımlanan modüllere buradan ulaşabilirsiniz. Sık
            kullandığınız işlemleri hızlı erişim kartlarına ekleyebilir ve
            duyuru alanından son gelişmeleri takip edebilirsiniz.
          </p>
        </div>
      </header>

      <section className="grid gap-4 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/80">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Sayfa Kısayolları
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Uygulamadaki tüm ekranlara tek tıkla ulaş.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {navigationLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col gap-2 rounded-2xl border border-slate-200/60 bg-white px-4 py-3 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:border-slate-800/60 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {item.title}
                </p>
                <ArrowRight className="h-4 w-4 text-primary transition group-hover:translate-x-1" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                {item.href}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((action) => (
          <button
            key={action.title}
            className="group flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:border-slate-800/70 dark:bg-slate-900"
            type="button"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary dark:bg-primary/25">
              <action.icon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {action.title}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Öne Çıkan Güncellemeler
            </h2>
            <button className="text-xs font-medium text-primary hover:text-primary/80">
              Duyuruları Gör
            </button>
          </div>
          <div className="space-y-4">
            {updates.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-4 text-sm transition hover:border-primary/40 dark:border-slate-800/70 dark:bg-slate-900/50"
              >
                <p className="font-medium text-slate-800 dark:text-slate-100">
                  {item.title}
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Kısayollar
          </h3>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>
              - Randevu takvimini görmek için sol menüden <strong>Takvim</strong> sekmesine geçebilirsin.
            </p>
            <p>
              - Yetki durumunu kontrol etmek için <strong>Profil &gt; Yetkilerim</strong> alanını ziyaret et.
            </p>
            <p>- Yardıma ihtiyacın varsa destek ekibiyle iletişime geçmeyi unutma.</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90"
          >
            Ayarlar
            <Settings className="h-4 w-4" />
          </button>
        </aside>
      </section>
    </div>
  );
}
