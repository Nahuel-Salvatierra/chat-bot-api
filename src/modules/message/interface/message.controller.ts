import { Controller, Get } from '@nestjs/common';

@Controller('message')
export class MessageController {
  @Get()
  getMessage() {
    return {
      message: 'Hello World',
    };
  }
}
