import { ConfigService } from '@nestjs/config';

import { AiService } from './ai.service.interface';
import { DevAiService } from './dev-ai.service';
import { OpenAiService } from './openapi.service';

export function createAiService(configService: ConfigService): AiService {
  const nodeEnv = configService.get('nodeEnv');

  if (nodeEnv === 'production') {
    return new OpenAiService(configService);
  }

  return new DevAiService();
}
