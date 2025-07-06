import { Body, Controller, Get, Post } from '@nestjs/common';

import { CurrentUserDto } from '@iam/authentication/domain/currentUser.dto';
import { CurrentUser } from '@iam/authentication/infrastructure/decorator/current-user.decorator';

import { CreateMessageDto } from '../application/dto/create-message-dto';
import { MessageService } from '../application/service/message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getMessages(@CurrentUser() user: CurrentUserDto) {
    return await this.messageService.getMessages(user.externalId);
  }

  @Post()
  async createMessage(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: CreateMessageDto,
  ) {
    return await this.messageService.createMessage(dto, user.externalId);
  }
}
