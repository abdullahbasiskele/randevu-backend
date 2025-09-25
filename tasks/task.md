# Proje Durumu

## Mevcut Özellikler
- NestJS tabanlı REST API aktif; `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/profile` ve CASL korumalı `/users` uç noktaları çalışıyor.
- JWT + string tabanlı refresh token akışı mevcut; token hash’leri `refresh_tokens` tablosunda tutuluyor, revokasyon destekli.
- E-Devlet OAuth2 stratejisi tanımlı; `/auth/edevlet` yönlendirmesi ve callback akışı profili sisteme bağlayıp token üretiyor.
- Prisma şeması kullanıcı rolleri/izinleri, refresh token ve harici sağlayıcı ilişkilerini kapsayacak şekilde genişletildi; seed script’i admin + izin verisi hazırlıyor.
- Scalar UI (`/docs`) üzerinden OpenAPI dokümantasyonu ve canlı deneme yapılabiliyor (`/docs-json` ham şema).
- Lint/build komutları temiz; kod QR ile TypeScript eslint kurallarını sağlıyor.

## Eksikler / Açık Noktalar
- E-Devlet OAuth ortam değişkenleri placeholder; gerçek client kimliği, secret ve URL’ler girilmeli.
- Refresh token body’de dönüyor; HTTP-only cookie veya cihaz bazlı yönetim henüz yok.
- Kullanıcı yönetimi (kayıt, güncelle, sil), parola sıfırlama gibi uç noktalar tanımlanmadı.
- Rate limiting, audit log gibi güvenlik/kayıt politikaları uygulamada etkinleştirilmedi.
- Deployment (Docker, CI/CD, prod logging) senaryoları ve izleme stratejisi planlanmadı.
