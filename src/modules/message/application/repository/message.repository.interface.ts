import { Message } from '../../domain/message.entity';

export const MESSAGE_REPOSITORY_KEY = 'MESSAGE_REPOSITORY';

export interface MessageRepository {
  create(message: Message): Promise<Message>;
  findMany(userId: string): Promise<Message[]>;
}
