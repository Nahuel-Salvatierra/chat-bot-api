import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';

import { AccessTokenGuard } from './authentication/infrastructure/guard/access-token.guard';
import { AuthenticationGuard } from './authentication/infrastructure/guard/authentication.guard';
import { FirebaseStrategy } from './authentication/infrastructure/passport/firebase.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'firebase' })],
  providers: [
    AccessTokenGuard,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    FirebaseStrategy,
  ],
})
export class IamModule {}
