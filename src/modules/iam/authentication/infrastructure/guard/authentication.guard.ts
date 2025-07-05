import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthType } from '../../domain/auth-type.enum';
import { AUTH_TYPE_KEY } from '../decorator/auth.decorator';
import { AccessTokenGuard } from './access-token.guard';

type AuthTypeGuardMap = Record<AuthType, CanActivate | CanActivate[]>;

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType: AuthType = AuthType.Bearer;
  private readonly authTypeGuardMap: AuthTypeGuardMap = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };
  constructor(
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.getAuthTypes(context) ?? [
      AuthenticationGuard.defaultAuthType,
    ];

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    let error = new UnauthorizedException();

    for (const guard of guards) {
      const canActivate = await Promise.resolve(
        guard.canActivate(context),
      ).catch((err) => {
        error = err;
      });

      if (canActivate) {
        return true;
      }
    }

    throw error;
  }

  private getAuthTypes(context: ExecutionContext): AuthType[] {
    return this.reflector.getAllAndOverride<AuthType[]>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
