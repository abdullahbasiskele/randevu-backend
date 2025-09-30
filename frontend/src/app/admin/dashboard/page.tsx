import {
  Activity,
  BarChart3,
  Bell,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from 'lucide-react';

const metricCards = [
  {
    title: 'Aktif Kullanıcı',
    value: '1.284',
    change: '+8.2%',
    description: 'Son 30 günlük artış',
    icon: Users,
  },
  {
    title: 'Günlük Randevu',
    value: '342',
    change: '+3.1%',
    description: 'Bugünün toplamı',
    icon: LayoutDashboard,
  },
  {
    title: 'Bekleyen Onay',
    value: '27',
    change: '−12%',
    description: 'Önceki haftaya göre',
    icon: Bell,
  },
];

const insights = [
  {
    title: 'Yetki Denetimi',
    description:
      'CASL kuralları üzerinden tanımlanan rollerin yüzde 96’sı uyumlu şekilde çalışıyor. Kalan izinler incelenmeli.',
    icon: ShieldCheck,
  },
  {
    title: 'Sistem Aktivitesi',
    description:
      'Son 24 saatte 4.129 API çağrısı yapıldı. Hata oranı %0.6 seviyesinde, ortalama yanıt süresi 212ms.',
    icon: Activity,
  },
  {
    title: 'Raporlama',
    description:
      'Haftalık randevu raporu hazır. PDF/CSV formatlarında indirmek için yönetim panelini ziyaret edin.',
    icon: BarChart3,
  },
];

const auditLogs = [
  {
    actor: 'admin@randevu.local',
    action: 'Yeni kullanıcı oluşturdu',
    timestamp: '10 dakika önce',
  },
  {
    actor: 'personel.kultur@randevu.local',
    action: 'Randevu kategorisi güncelledi',
    timestamp: '32 dakika önce',
  },
  {
    actor: 'destek@randevu.local',
    action: 'OAuth2 entegrasyon anahtarı yenilendi',
    timestamp: '1 saat önce',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <header className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          <ShieldCheck className="h-4 w-4" /> Yetkili Yönetici Görünümü
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Randevu Yönetim Paneli
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Sistem sağlığını izleyin, rol bazlı yetkilendirmeleri yönetin ve
          kritik aksiyonlara tek ekrandan erişin.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {metricCards.map((card) => (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900"
          >
            <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
              <div className="h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-indigo-500/10" />
            </div>
            <div className="relative flex flex-col gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary dark:bg-primary/25">
                <card.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>
                <p className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                  {card.value}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {card.change}
                </span>
                <span>{card.description}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Güncel İçgörüler
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {insights.map((item) => (
              <div
                key={item.title}
                className="flex h-full flex-col gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 transition hover:border-primary/40 dark:border-slate-800/80 dark:bg-slate-900/60"
              >
                <div className="flex items-center gap-3 text-primary">
                  <item.icon className="h-5 w-5" />
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                    {item.title}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Son İşlemler
            </h2>
            <button className="text-xs font-medium text-primary hover:text-primary/80">
              Tümünü gör
            </button>
          </div>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.actor + log.timestamp}
                className="rounded-xl border border-slate-200/60 bg-slate-50/70 p-4 dark:border-slate-800/60 dark:bg-slate-900/40"
              >
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {log.actor}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {log.action}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {log.timestamp}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
