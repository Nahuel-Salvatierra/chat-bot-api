import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class MockAuthenticationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === '') {
      return false;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      request.user = {
        id: decodedToken.uid,
        externalId: decodedToken.uid,
        username: decodedToken.email || decodedToken.uid,
      };

      return true;
    } catch (error) {
      return false;
    }
  }
}
