import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MESSAGE_REPOSITORY_KEY } from './application/repository/message.repository.interface';
import { createAiService } from './application/service/ai.service.factory';
import { IA_SERVICE_KEY } from './application/service/ai.service.interface';
import { MessageService } from './application/service/message.service';
import { FirebaseMessageRepository } from './infrastructure/persistence/firebase.message.repository';
import { MessageController } from './interface/message.controller';

@Module({
  controllers: [MessageController],
  providers: [
    {
      provide: MESSAGE_REPOSITORY_KEY,
      useClass: FirebaseMessageRepository,
    },
    {
      provide: IA_SERVICE_KEY,
      useFactory: (configService: ConfigService) =>
        createAiService(configService),
      inject: [ConfigService],
    },
    MessageService,
  ],
})
export class MessageModule {}
