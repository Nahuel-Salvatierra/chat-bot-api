export const IA_SERVICE_KEY = 'IA_SERVICE_KEY';

export interface AiService {
  generateResponse(
    userMessage: string,
    conversationHistory?: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>,
  ): Promise<{ message: string }>;
}
