import * as uuid from 'uuid';

import { Message, MessageRole } from '../../domain/message.entity';
import { CreateMessageDto } from '../dto/create-message-dto';

export class MessageMapper {
  static toUserMessageDomain(
    message: CreateMessageDto,
    userId: string,
  ): Message {
    return new Message(
      uuid.v4(),
      message.content,
      MessageRole.USER,
      userId,
      new Date(),
    );
  }

  static toAiMessageDomain(message: string, userId: string): Message {
    const aiMessage = new Message(
      uuid.v4(),
      message,
      MessageRole.ASSISTANT,
      userId,
      new Date(),
    );

    return aiMessage;
  }
}
