import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configuration } from './configuration/configuration';
import { IamModule } from './modules/iam/iam.module';
import { MessageModule } from './modules/message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    IamModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
