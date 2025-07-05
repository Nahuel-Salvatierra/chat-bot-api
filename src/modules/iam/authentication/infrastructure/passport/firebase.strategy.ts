import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as admin from 'firebase-admin';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

import { CurrentUserDto } from '../../domain/currentUser.dto';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor(private readonly configService: ConfigService) {
    const firebaseConfig = configService.get('firebase');

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseConfig.projectId,
          clientEmail: firebaseConfig.clientEmail,
          privateKey: firebaseConfig.privateKey,
        }),
      });
    }

    const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'firebase-jwt-secret-placeholder',
      passReqToCallback: true,
    };
    super(options);
  }

  async validate(req: any, payload: any): Promise<CurrentUserDto> {
    try {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

      if (!token) {
        throw new Error('No token provided');
      }

      const decodedToken = await admin.auth().verifyIdToken(token);

      return this.mapToUser(decodedToken);
    } catch (error) {
      throw new Error(`Invalid Firebase token: ${error.message}`);
    }
  }

  private mapToUser(firebaseUser: admin.auth.DecodedIdToken): CurrentUserDto {
    const user = new CurrentUserDto();
    user.externalId = firebaseUser.uid;
    user.username = firebaseUser.email || firebaseUser.uid;
    return user;
  }
}
