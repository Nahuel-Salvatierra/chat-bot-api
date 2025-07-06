import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { Message } from '../../domain/message.entity';
import { CreateMessageDto } from '../dto/create-message-dto';
import { MessageMapper } from '../mapper/message.mapper';
import {
  MESSAGE_REPOSITORY_KEY,
  MessageRepository,
} from '../repository/message.repository.interface';
import { AiService, IA_SERVICE_KEY } from './ai.service.interface';

@Injectable()
export class MessageService {
  constructor(
    @Inject(MESSAGE_REPOSITORY_KEY)
    private readonly messageRepository: MessageRepository,
    @Inject(IA_SERVICE_KEY)
    private readonly aiService: AiService,
  ) {}

  async getMessages(userId: string): Promise<Message[]> {
    return this.messageRepository.findMany(userId);
  }

  async createMessage(dto: CreateMessageDto, userId: string): Promise<Message> {
    console.log(userId);

    try {
      const messageDomain = MessageMapper.toUserMessageDomain(dto, userId);
      const userMessage = await this.messageRepository.create(messageDomain);
      const { message: aiMessage } = await this.aiService.generateResponse(
        userMessage.content,
      );

      const aiMessageDomain = MessageMapper.toAiMessageDomain(
        aiMessage,
        userId,
      );

      return this.messageRepository.create(aiMessageDomain);
    } catch (error) {
      console.error('Error creating message:', error);
      throw new HttpException(
        'Failed to create message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
