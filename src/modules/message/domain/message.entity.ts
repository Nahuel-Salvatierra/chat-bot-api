export class Message {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly role: 'user' | 'assistant',
    public readonly userId: string,
    public readonly timestamp: Date,
  ) {}

  static create(
    content: string,
    role: 'user' | 'assistant',
    userId: string,
  ): {
    content: string;
    role: 'user' | 'assistant';
    userId: string;
  } {
    return {
      content,
      role,
      userId,
    };
  }

  isUserMessage(): boolean {
    return this.role === 'user';
  }

  isAssistantMessage(): boolean {
    return this.role === 'assistant';
  }
}
