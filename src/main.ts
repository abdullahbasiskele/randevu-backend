import type { Express } from 'express';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Randevu API')
    .setDescription(
      'Randevu backend için kimlik doğrulama ve yetkilendirme uç noktaları',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/docs',
    apiReference({
      pageTitle: 'Randevu API Referansı',
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
