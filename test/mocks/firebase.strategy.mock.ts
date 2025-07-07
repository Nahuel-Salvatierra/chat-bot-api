import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { CurrentUserDto } from '@iam/authentication/domain/current-user.dto';

@Injectable()
export class MockJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'tests',
      passReqToCallback: true,
    };
    super(options);
  }

  async validate(): Promise<CurrentUserDto> {
    return this.mapToUser();
  }

  private mapToUser(): CurrentUserDto {
    const user = new CurrentUserDto();
    user.externalId = '123';
    user.id = '123';
    user.username = 'test';

    return user;
  }
}
