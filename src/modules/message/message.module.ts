import { Module } from '@nestjs/common';

import { MESSAGE_REPOSITORY_KEY } from './application/repository/message.repository.interface';
import { MessageService } from './application/service/message.service';
import { FirebaseMessageRepository } from './infrastructure/persistance/firebase-message.repository';
import { MessageController } from './interface/message.controller';

@Module({
  controllers: [MessageController],
  providers: [
    {
      provide: MESSAGE_REPOSITORY_KEY,
      useClass: FirebaseMessageRepository,
    },
    MessageService,
  ],
  exports: [],
})
export class MessageModule {}
