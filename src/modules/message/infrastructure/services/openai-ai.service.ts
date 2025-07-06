import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenAiAiService {
  async generateResponse(
    userMessage: string,
    conversationHistory: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>,
  ): Promise<string> {
    const messages = [
      {
        role: 'system' as const,
        content:
          'You are a helpful AI assistant. Provide clear and concise responses.',
      },
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: userMessage,
      },
    ];

    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages,
            max_tokens: 1000,
            temperature: 0.7,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return 'Lo siento, no pude procesar tu mensaje en este momento.';
    }
  }
}
