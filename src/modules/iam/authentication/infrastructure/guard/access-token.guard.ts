import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as admin from 'firebase-admin';

@Injectable()
export class AccessTokenGuard extends AuthGuard('firebase') {
  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return false;
    }

    try {
      const booleanResult = await admin
        .auth()
        .verifyIdToken(request.headers.authorization.split(' ')[1]);
      return !!booleanResult;
    } catch (error) {
      throw error;
    }
  }
}
