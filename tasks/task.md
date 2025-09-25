# Proje Durumu

## Sunulan Ozellikler
- **Backend (NestJS)**: Lokal e-posta/parola dogrulama, JWT ve refresh token uretimi, CASL tabanli yetkilendirme ve profil uc noktalarinin calismasi. Token yenileme ve oturum sonlandirma akisleri Prisma tablosu ile entegre.
- **OAuth2 Hazirligi**: E-Devlet stratejisi, yonlendirme ve callback kancalari tanimli; gercek istemci bilgileri girildiginde ayni token akisina baglanmaya hazir.
- **Prisma Altyapisi**: Kullanici, rol, izin ve iliski tablolarinda UUID kimlikler; seed betigi yonetici hesabi ve ornek rol/izin verisi olusturuyor.
- **API Dokumantasyonu**: Scalar arayuzu uzerinden /docs rotasinda OpenAPI semasi ve deneme istekleri ulasilabilir.
- **Frontend (Next.js)**: 3010 portunda calisan modern login ekrani; email/parola ile backend'e istek atiyor, form dogrulamasi (Zod + react-hook-form) ve hata mesajlari hazir.

## Bilinen Aciklar / Eksikler
- **Kimlik Dogrulama**: Refresh token artik HTTP-only, secure cookie uzerinden yonetiliyor; sonraki adim olarak cihaz bazli oturum takibi, rotasyon ve ek guvenlik politikalarini planlamak gerekiyor.
- **OAuth2**: .env icindeki E-Devlet URL ve client alanlari gercek degerlerle guncellenmeli; callback icin ek guvenlik kontrolleri eksik.
- **Yetki/Sessiyon Yonetimi**: Kullanici kaydet/guncelle/sil uc noktalarinin, parola sifirlama, brute force korumasi, rate limiting ve audit log politikalarinin eklenmesi gerekiyor.
- **Frontend**: Login sonrasi yonlendirme ve global auth state (NextAuth entegrasyonu) eksik; "parolami unuttum" ve SSO butonlari simdilik placeholder.
- **Operasyonlar**: Docker/CI/CD, loglama/monitoring, test senaryolari (frontend e2e + backend e2e) ve production konfigurasyonlari hazirlanmadi.

Bir sonraki gelistirme adimlarini birlikte belirleyebiliriz.
