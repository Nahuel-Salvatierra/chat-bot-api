import { Injectable } from '@nestjs/common';

import { MessageRepository } from '@root/src/modules/message/application/repository/message.repository.interface';
import {
  Message,
  MessageRole,
} from '@root/src/modules/message/domain/message.entity';

@Injectable()
export class MockMessageRepository implements MessageRepository {
  async create(message: Message): Promise<Message> {
    console.log('MockMessageRepository.create called with:', message);
    return message;
  }

  async findMany(userId: string): Promise<Message[]> {
    console.log('MockMessageRepository.findMany called with userId:', userId);
    return [
      new Message('1', 'Test message 1', MessageRole.USER, userId, new Date()),
      new Message(
        '2',
        'Test message 2',
        MessageRole.ASSISTANT,
        userId,
        new Date(),
      ),
    ];
  }
}
