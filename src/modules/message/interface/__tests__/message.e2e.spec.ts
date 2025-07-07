import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { bootstrapModuleTest } from '@root/test/bootstrap';

import {
  MESSAGE_REPOSITORY_KEY,
  MessageRepository,
} from '../../application/repository/message.repository.interface';
import { Message, MessageRole } from '../../domain/message.entity';

describe('Message e2e', () => {
  let app: INestApplication;
  let repositoryMessage: MessageRepository;

  const createSuccess = () =>
    jest
      .spyOn(repositoryMessage, 'create')
      .mockResolvedValue(
        new Message(
          '1',
          'Hello, how are you?',
          MessageRole.USER,
          'test-user-id',
          new Date(),
        ),
      );

  const findManySuccess = () =>
    jest
      .spyOn(repositoryMessage, 'findMany')
      .mockResolvedValue([
        new Message(
          '1',
          'Hello, how are you?',
          MessageRole.USER,
          'test-user-id',
          new Date(),
        ),
      ]);

  const findManyEmpty = () =>
    jest.spyOn(repositoryMessage, 'findMany').mockResolvedValue([]);

  beforeAll(async () => {
    const module: TestingModule = await bootstrapModuleTest();
    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    repositoryMessage = module.get<MessageRepository>(MESSAGE_REPOSITORY_KEY);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /messages', () => {
    it('should return all messages for authenticated user', async () => {
      findManySuccess();

      await request(app.getHttpServer())
        .get('/messages')
        .set('Authorization', 'Bearer test-token')
        .expect(200)
        .then(({ body }) => {
          const expectedResponse = expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              content: expect.any(String),
              role: expect.any(String),
              userId: expect.any(String),
            }),
          ]);

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should return empty array when no messages exist', async () => {
      findManyEmpty();

      await request(app.getHttpServer())
        .get('/messages')
        .set('Authorization', 'Bearer test-token')
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual([]);
        });
    });

    it('should return 401 when no authorization header', async () => {
      await request(app.getHttpServer()).get('/messages').expect(401);
    });

    it('should return 401 when invalid token format', async () => {
      await request(app.getHttpServer())
        .get('/messages')
        .set('Authorization', 'InvalidToken')
        .expect(401);
    });

    it('should return 401 when empty bearer token', async () => {
      await request(app.getHttpServer())
        .get('/messages')
        .set('Authorization', 'Bearer ')
        .expect(401);
    });
  });

  describe('POST /messages', () => {
    it('should create a new message and return AI response', async () => {
      createSuccess();

      await request(app.getHttpServer())
        .post('/messages')
        .set('Authorization', 'Bearer test-token')
        .send({ content: 'Hello, how are you?' })
        .expect(201)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: expect.any(String),
            content: expect.any(String),
            role: expect.any(String),
            userId: expect.any(String),
          });
          expect(body).toEqual(expectedResponse);
        });
    });

    it('should create message with valid content', async () => {
      createSuccess();

      await request(app.getHttpServer())
        .post('/messages')
        .set('Authorization', 'Bearer test-token')
        .send({ content: 'Test message' })
        .expect(201);
    });

    it('should return 400 when content is missing', async () => {
      await request(app.getHttpServer())
        .post('/messages')
        .set('Authorization', 'Bearer test-token')
        .send({})
        .expect(400);
    });

    it('should return 400 when content is empty string', async () => {
      await request(app.getHttpServer())
        .post('/messages')
        .set('Authorization', 'Bearer test-token')
        .send({ content: '' })
        .expect(400);
    });

    it('should return 400 when content is too short', async () => {
      await request(app.getHttpServer())
        .post('/messages')
        .set('Authorization', 'Bearer test-token')
        .send({ content: 'Hi' })
        .then((res) => {
          console.log(res.body);
          expect(res.status).toBe(400);
        });
    });

    it('should return 400 when content is not a string', async () => {
      await request(app.getHttpServer())
        .post('/messages')
        .set('Authorization', 'Bearer test-token')
        .send({ content: 123 })
        .expect(400);
    });
  });
});
