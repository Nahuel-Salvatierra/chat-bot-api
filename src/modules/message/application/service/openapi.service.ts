import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

import { AiService } from './ai.service.interface';

@Injectable()
export class OpenAiService implements AiService {
  private readonly client: OpenAI;
  constructor(configService: ConfigService) {
    const apiKey = configService.get('openai.apiKey');
    this.client = new OpenAI({
      apiKey,
    });
  }

  async generateResponse(userMessage: string): Promise<{ message: string }> {
    const response = await this.client.responses.create({
      model: 'gpt-4o-mini',
      input: userMessage,
      instructions:
        'You are a helpful assistant that can answer questions and help with tasks.',
    });

    console.log(response);

    return { message: response.output_text };
  }
}
