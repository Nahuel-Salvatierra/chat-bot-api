import { Message } from '../../domain/message.entity';

export const MESSAGE_REPOSITORY_KEY = 'MESSAGE_REPOSITORY';

export interface MessageRepository {
  create(message: {
    content: string;
    role: 'user' | 'assistant';
    userId: string;
  }): Promise<Message>;
  findById(id: string): Promise<Message | null>;
  findByUserId(userId: string): Promise<Message[]>;
  findMany(userId: string): Promise<Message[]>;
  deleteById(id: string): Promise<void>;
}
