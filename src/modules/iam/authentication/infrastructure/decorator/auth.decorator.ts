import { SetMetadata } from '@nestjs/common';

import { AuthType } from '../../domain/auth-type.enum';

export const AUTH_TYPE_KEY = 'AUTH_TYPE';

export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
