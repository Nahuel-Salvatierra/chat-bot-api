import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import * as admin from 'firebase-admin';

import { CurrentUserDto } from '../../domain/currentUser.dto';

export const CurrentUser = createParamDecorator(
  async (field: keyof CurrentUserDto, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    const payload = await admin.auth().verifyIdToken(token);
    const user: CurrentUserDto = {
      externalId: payload.uid,
      username: payload.email,
    };
    return field ? user?.[field] : user;
  },
);
