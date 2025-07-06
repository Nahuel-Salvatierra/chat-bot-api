export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export class Message {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly role: MessageRole,
    public readonly userId: string,
    public readonly timestamp: Date,
  ) {}

  static create(
    content: string,
    role: MessageRole,
    userId: string,
  ): {
    content: string;
    role: MessageRole;
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
