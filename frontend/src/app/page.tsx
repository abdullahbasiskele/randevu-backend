export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">
          Randevu Platformu Frontend
        </h1>
        <p className="mt-4 text-slate-600">
          Next.js 14+, NextAuth hibrit oturum yönetimi, CASL yetkilendirme ve
          Clean Architecture prensipleri için temel iskelet hazır. Backend
          API&apos;leri ile entegrasyon ve UI bileşenlerinin geliştirilmesine
          buradan devam edebilirsiniz.
        </p>
      </section>
    </main>
  );
}
