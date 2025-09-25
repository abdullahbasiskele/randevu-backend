import cookieParser from 'cookie-parser';
import type { Express } from 'express';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const rawOrigins = process.env.CORS_ORIGINS ?? '';
  const allowedOrigins = rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (allowedOrigins.length === 0) {
    allowedOrigins.push('http://localhost:3010');
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
  });

  const config = new DocumentBuilder()
    .setTitle('Randevu API')
    .setDescription(
      'Randevu backend icin kimlik dogrulama ve yetkilendirme uc noktalari',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/docs',
    apiReference({
      pageTitle: 'Randevu API Referansi',
      content: document,
    }),
  );

  const httpServer = app.getHttpAdapter().getInstance() as Express;
  httpServer.get('/docs-json', (_req, res) => {
    res.json(document);
  });

  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
