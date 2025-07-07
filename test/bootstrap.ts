import { UnauthorizedException } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { FirebaseStrategy } from '@iam/authentication/infrastructure/passport/firebase.strategy';

import { AppModule } from '@/app.module';

import { MockAuthenticationGuard } from './mocks/authentication.guard.mock';
import { MockJwtStrategy } from './mocks/firebase.strategy.mock';

jest.mock('firebase-admin', () => ({
  auth: () => ({
    verifyIdToken: jest.fn().mockImplementation((token) => {
      if (token === 'test-token') {
        return Promise.resolve({
          uid: 'test-external-id',
          email: 'test@example.com',
        });
      }
      return Promise.reject(new UnauthorizedException('Invalid token'));
    }),
  }),
  apps: [],
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  database: jest.fn(),
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => ({
            content: 'test content',
            role: 'user',
            userId: 'test-user',
            createdAt: new Date().toISOString(),
          }),
        }),
      })),
      where: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          limit: jest.fn(() => ({
            offset: jest.fn(() => ({
              get: jest.fn().mockResolvedValue({
                docs: [],
                val: () => null,
              }),
            })),
          })),
          get: jest.fn().mockResolvedValue({
            docs: [],
            val: () => null,
          }),
        })),
        equalTo: jest.fn(() => ({
          once: jest.fn().mockResolvedValue({
            val: () => null,
          }),
        })),
      })),
      orderByChild: jest.fn(() => ({
        equalTo: jest.fn(() => ({
          once: jest.fn().mockResolvedValue({
            val: () => null,
          }),
        })),
      })),
      child: jest.fn(() => ({
        get: jest.fn().mockResolvedValue({
          exists: false,
        }),
        remove: jest.fn().mockResolvedValue(undefined),
      })),
      push: jest.fn(() => ({
        key: 'test-key',
        set: jest.fn().mockResolvedValue(undefined),
      })),
    })),
    FieldValue: {
      serverTimestamp: jest.fn(() => new Date().toISOString()),
    },
  })),
  FieldValue: {
    serverTimestamp: jest.fn(() => new Date().toISOString()),
  },
  admin: {
    firestore: {
      FieldValue: {
        serverTimestamp: jest.fn(() => new Date().toISOString()),
      },
    },
  },
}));

export async function bootstrapModuleTest(): Promise<TestingModule> {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(FirebaseStrategy)
    .useValue(MockJwtStrategy)
    .overrideProvider(APP_GUARD)
    .useValue(MockAuthenticationGuard)
    .compile();

  return module;
}
