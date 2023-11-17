import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { errorMessages } from '../src/constants/error-messages';
import { createValidUserInput } from './faker/user-fake-data';
import { getJwtToken } from './utils/get-jwt-token';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a user when valid input is provided', async () => {
    const validUserInput = createValidUserInput();

    const response = await request(app.getHttpServer())
      .post('/user/register')
      .send(validUserInput)
      .expect(HttpStatus.CREATED);

    const registerUserResponse = {
      id: response.body.id,
      name: validUserInput.name,
      email: validUserInput.email,
      created_at: response.body.created_at,
      updated_at: response.body.updated_at,
    };

    expect(response.body).toEqual(registerUserResponse);

    // Send a POST request to the register endpoint with duplicate name
    const responseDuplicateName = await request(app.getHttpServer())
      .post('/user/register')
      .send(validUserInput)
      .expect(HttpStatus.BAD_REQUEST);

    expect(responseDuplicateName.body.message).toContain(errorMessages.DUPLICATE_NAME(validUserInput.name));

    // Send a POST request to the register endpoint with duplicate email
    validUserInput.name = 'TestUser2';
    const responseDuplicateEmail = await request(app.getHttpServer())
      .post('/user/register')
      .send(validUserInput)
      .expect(HttpStatus.BAD_REQUEST);

    expect(responseDuplicateEmail.body.message).toContain(errorMessages.DUPLICATE_EMAIL(validUserInput.email));

    const validToken = getJwtToken(registerUserResponse.id);
    await request(app.getHttpServer())
      .delete(`/user`)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(HttpStatus.OK);
  });

  it('should successfully login a user with valid credentials', async () => {
    const validUserInput = createValidUserInput();
    const registerResponse = await request(app.getHttpServer())
      .post('/user/register')
      .send(validUserInput)
      .expect(HttpStatus.CREATED);

    const validLoginDto = {
      email: registerResponse.body.email,
      password: validUserInput.password,
    };

    const response = await request(app.getHttpServer()).post('/user/login').send(validLoginDto).expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('exp');

    const validToken = getJwtToken(registerResponse.body.id);
    await request(app.getHttpServer())
      .delete(`/user`)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(HttpStatus.OK);
  });

  it('should return a 403 status for an invalid credentials', async () => {
    const invalidLoginDto = {
      email: 'nonexistent@example.com',
      password: 'invalidPassword',
    };

    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send(invalidLoginDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('should return a user when an user is authenticated', async () => {
    const validUserInput = createValidUserInput();
    const registerUserResponse = await request(app.getHttpServer())
      .post('/user/register')
      .send(validUserInput)
      .expect(HttpStatus.CREATED);

    const expectedUser = {
      id: registerUserResponse.body.id,
      name: registerUserResponse.body.name,
      email: registerUserResponse.body.email,
      created_at: registerUserResponse.body.created_at,
      updated_at: registerUserResponse.body.updated_at,
    };

    const validToken = getJwtToken(expectedUser.id);

    const response = await request(app.getHttpServer())
      .get(`/user`)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(expectedUser);

    await request(app.getHttpServer())
      .delete(`/user`)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(HttpStatus.OK);
  });

  it('should return a 401 error when an user isn`t authenticated', async () => {
    const invalidToken = 'nonexistent';

    const response = await request(app.getHttpServer())
      .get(`/user`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body.message).toBe('Unauthorized');
  });

  it('Access token become invalid on logout', async () => {
    const validUserInput = createValidUserInput();
    const registerUserResponse = await request(app.getHttpServer())
      .post('/user/register')
      .send(validUserInput)
      .expect(HttpStatus.CREATED);
    const { id, email } = registerUserResponse.body;

    const validLoginDto = {
      email: email,
      password: validUserInput.password,
    };
    const loginResponse = await request(app.getHttpServer())
      .post('/user/login')
      .send(validLoginDto)
      .expect(HttpStatus.OK);
    const { token } = loginResponse.body;

    const response = await request(app.getHttpServer())
      .post(`/user/logout${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({ success: true });

    const responseLogoutTrue = await request(app.getHttpServer())
      .get(`/user`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.UNAUTHORIZED);

    // cleanup DB
    const validToken = getJwtToken(id);
    await request(app.getHttpServer())
      .delete(`/user`)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(HttpStatus.OK);
  });

  it('should return 200 when an user is deleted', async () => {
    const validUserInput = createValidUserInput();
    const registerUserResponse = await request(app.getHttpServer())
      .post('/user/register')
      .send(validUserInput)
      .expect(HttpStatus.CREATED);
    const { email } = registerUserResponse.body;

    const validLoginDto = {
      email: email,
      password: validUserInput.password,
    };
    const loginResponse = await request(app.getHttpServer())
      .post('/user/login')
      .send(validLoginDto)
      .expect(HttpStatus.OK);
    const { token } = loginResponse.body;

    const response = await request(app.getHttpServer())
      .delete(`/user`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({ success: true });
  });

  it('should return user with updated name', async () => {
    const validUserInput = createValidUserInput();
    const registerUserResponse = await request(app.getHttpServer())
      .post('/user/register')
      .send(validUserInput)
      .expect(HttpStatus.CREATED);
    const { id, email } = registerUserResponse.body;

    const validLoginDto = {
      email: email,
      password: validUserInput.password,
    };
    const loginResponse = await request(app.getHttpServer())
      .post('/user/login')
      .send(validLoginDto)
      .expect(HttpStatus.OK);
    const { token } = loginResponse.body;

    const updatedName = 'updatedName';
    const response = await request(app.getHttpServer())
      .patch(`/user`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: updatedName })
      .expect(HttpStatus.OK);

    expect(response.body.name).toEqual(updatedName);

    const validToken = getJwtToken(id);
    await request(app.getHttpServer())
      .delete(`/user`)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(HttpStatus.OK);
  });

  it('should return 400 when an user is updated with existing email ', async () => {
    const validUserInput1 = createValidUserInput();
    const registerUserResponse1 = await request(app.getHttpServer())
      .post('/user/register')
      .send(validUserInput1)
      .expect(HttpStatus.CREATED);
    const { email } = registerUserResponse1.body;

    const validLoginDto1 = {
      email: email,
      password: validUserInput1.password,
    };

    const validUserInput2 = createValidUserInput();
    const registerUserResponse2 = await request(app.getHttpServer())
      .post('/user/register')
      .send(validUserInput2)
      .expect(HttpStatus.CREATED);

    const existingEmail = registerUserResponse2.body.email;

    const loginResponse = await request(app.getHttpServer())
      .post('/user/login')
      .send(validLoginDto1)
      .expect(HttpStatus.OK);

    const { token } = loginResponse.body;

    const response = await request(app.getHttpServer())
      .patch(`/user`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: existingEmail })
      .expect(HttpStatus.BAD_REQUEST);
  });
});
