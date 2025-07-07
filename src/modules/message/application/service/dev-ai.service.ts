import { Injectable } from '@nestjs/common';

import { AiService } from './ai.service.interface';

@Injectable()
export class DevAiService implements AiService {
  private responses = [
    'Hello! I am your development assistant. How can I help you?',
    'Interesting question. Let me think about that...',
    'In development mode, I can respond to anything. What would you like to know?',
    'Excellent! I am here to help you with whatever you need.',
  ];

  async generateResponse(
    userMessage: string,
    conversationHistory?: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>,
  ): Promise<{ message: string }> {
    console.log('userMessage', userMessage);
    console.log('conversationHistory', conversationHistory);
    const randomIndex = Math.floor(Math.random() * this.responses.length);
    return { message: this.responses[randomIndex] };
  }
}
