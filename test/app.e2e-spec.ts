import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request, { SuperTest, Test as RequestTest } from 'supertest';
import { AppModule } from './../src/app.module';

type HttpServerLike = Parameters<typeof request>[0];

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpClient: SuperTest<RequestTest>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const server = app.getHttpServer() as HttpServerLike;
    httpClient = request(server);
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET / returns Hello World!', async () => {
    const response = await httpClient.get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });
});
