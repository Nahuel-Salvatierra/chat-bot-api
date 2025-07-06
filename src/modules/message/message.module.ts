import { Module } from '@nestjs/common';

import { MESSAGE_REPOSITORY_KEY } from './application/repository/message.repository.interface';
import { IA_SERVICE_KEY } from './application/service/ai.service.interface';
import { MessageService } from './application/service/message.service';
import { OpenAiService } from './application/service/openapi.service';
import { FirebaseMessageRepository } from './infrastructure/persistence/firebase-message.repository';
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
      useClass: OpenAiService,
    },
    MessageService,
  ],
})
export class MessageModule {}
