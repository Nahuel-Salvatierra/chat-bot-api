export interface AiService {
  generateResponse(
    userMessage: string,
    conversationHistory: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>,
  ): Promise<string>;
}
