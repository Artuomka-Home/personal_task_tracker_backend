import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { sign } from 'jsonwebtoken';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let validToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    validToken = sign({ id: '1' }, process.env.JWT_SECRET_KEY);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a user when an user is authenticated', async () => {
    const userId = 1;
    const name = 'Yagor';
    const email = 'testYagor@gmail.com';
    const created_at = '2023-10-09T12:58:07.964Z';
    const updated_at = '2023-10-09T12:58:07.964Z';

    const expectedUser = {
      id: userId,
      name,
      email,
      created_at,
      updated_at,
    };

    const response = await request(app.getHttpServer())
      .get(`/user`)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(expectedUser);
  });

  it('should return a 401 error when an user isn`t authenticated', async () => {
    const invalidToken = 'nonexistent';

    const response = await request(app.getHttpServer())
      .get(`/user`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body.message).toBe('Unauthorized');
  });
});
