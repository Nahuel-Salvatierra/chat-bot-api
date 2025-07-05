import { Inject, Injectable } from '@nestjs/common';

import { Message } from '../../domain/message.entity';
import {
  MESSAGE_REPOSITORY_KEY,
  MessageRepository,
} from '../repository/message.repository.interface';

@Injectable()
export class MessageService {
  constructor(
    @Inject(MESSAGE_REPOSITORY_KEY)
    private readonly messageRepository: MessageRepository,
  ) {}

  async createMessage(message: Message): Promise<Message> {
    return this.messageRepository.create(message);
  }
}
