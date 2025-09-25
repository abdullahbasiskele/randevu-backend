import cookieParser from 'cookie-parser';
import { hash } from 'bcryptjs';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma/prisma.service';

const TEST_USER_EMAIL = 'auth.e2e@randevu.local';
const TEST_USER_PASSWORD = 'AuthE2e123!';
const REFRESH_COOKIE_NAME = 'refresh_token';

function extractCookie(headers: string | string[] | undefined, name: string): string | undefined {
  if (!headers) {
    return undefined;
  }

  const cookieList = Array.isArray(headers) ? headers : [headers];
  const rawCookie = cookieList.find((header) => header.startsWith(`${name}=`));
  if (!rawCookie) {
    return undefined;
  }

  return rawCookie.split(';', 1)[0];
}

type HttpClient = ReturnType<typeof request>;

describe('Auth HTTP flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpClient: HttpClient;
  let createdUserId: string | undefined;
  const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS ?? 12);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();

    prisma = app.get(PrismaService);

    const existingUser = await prisma.user.findUnique({
      where: { email: TEST_USER_EMAIL },
    });

    if (existingUser) {
      await prisma.refreshToken.deleteMany({ where: { userId: existingUser.id } });
      await prisma.user.delete({ where: { id: existingUser.id } });
    }

    const passwordHash = await hash(TEST_USER_PASSWORD, saltRounds);
    const user = await prisma.user.create({
      data: {
        email: TEST_USER_EMAIL,
        password: passwordHash,
        isActive: true,
      },
    });

    createdUserId = user.id;
    httpClient = request(app.getHttpServer());
  });

  afterAll(async () => {
    if (createdUserId) {
      await prisma.refreshToken.deleteMany({ where: { userId: createdUserId } });
      await prisma.user.delete({ where: { id: createdUserId } }).catch(() => undefined);
    }

    await app.close();
  });

  it('issues, rotates and revokes refresh tokens via HTTP-only cookie', async () => {
    const loginResponse = await httpClient
      .post('/auth/login')
      .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD })
      .expect(201);

    expect(loginResponse.body.accessToken).toEqual(expect.any(String));

    const loginCookie = extractCookie(loginResponse.get('set-cookie'), REFRESH_COOKIE_NAME);
    expect(loginCookie).toBeDefined();

    const refreshResponse = await httpClient
      .post('/auth/refresh')
      .set('Cookie', loginCookie as string)
      .expect(201);

    expect(refreshResponse.body.accessToken).toEqual(expect.any(String));

    const rotatedCookie = extractCookie(refreshResponse.get('set-cookie'), REFRESH_COOKIE_NAME);
    expect(rotatedCookie).toBeDefined();
    expect(rotatedCookie).not.toEqual(loginCookie);

    await httpClient.post('/auth/logout').set('Cookie', rotatedCookie as string).expect(204);

    await httpClient
      .post('/auth/refresh')
      .set('Cookie', rotatedCookie as string)
      .expect(401);
  });
});