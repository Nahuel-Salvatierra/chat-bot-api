import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { REQUEST_USER_KEY } from '@iam/iam.constants';
import { CurrentUserDto } from '../../domain/currentUser.dto';

export const CurrentUser = createParamDecorator(
  (field: keyof CurrentUserDto, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: CurrentUserDto = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
