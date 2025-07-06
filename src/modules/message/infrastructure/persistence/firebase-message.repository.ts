import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

import { MessageRepository } from '../../application/repository/message.repository.interface';
import { Message } from '../../domain/message.entity';

@Injectable()
export class FirebaseMessageRepository implements MessageRepository {
  private readonly db: admin.database.Database;

  constructor(private readonly configService: ConfigService) {
    const firebaseConfig = this.configService.get('firebase');

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseConfig.projectId,
          clientEmail: firebaseConfig.clientEmail,
          privateKey: firebaseConfig.privateKey,
        }),
        databaseURL: firebaseConfig.databaseURL,
      });

      this.db = admin.database();
    }
    this.db = admin.database();
  }

  async create(message: Message): Promise<Message> {
    const messageData = {
      content: message.content,
      role: message.role,
      userId: message.userId,
      timestamp: new Date().toISOString(),
    };

    const filteredData = Object.fromEntries(
      Object.entries(messageData).filter(([, value]) => value !== undefined),
    );

    const docRef = this.db.ref('messages');
    const ref = docRef.push();
    await ref.set(filteredData);

    return new Message(
      ref.key!,
      message.content,
      message.role,
      message.userId,
      new Date(),
    );
  }

  async findById(id: string): Promise<Message | null> {
    const doc = await this.db.ref('messages').child(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.val()!;
    return new Message(
      doc.key!,
      data.content,
      data.role,
      data.userId,
      new Date(data.timestamp),
    );
  }

  async findByUserId(userId: string): Promise<Message[]> {
    const snapshot = await this.db
      .ref('messages')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');

    const data = snapshot.val();
    if (!data) {
      return [];
    }

    return Object.entries(data).map(([key, value]: [string, any]) => {
      return new Message(
        key,
        value.content,
        value.role,
        value.userId,
        new Date(value.timestamp),
      );
    });
  }

  async findMany(userId: string): Promise<Message[]> {
    const limit = 10;
    const offset = 0;
    console.log('=== FIND MANY DEBUG ===');
    console.log('userId:', userId);

    if (!userId) {
      console.log('userId is undefined, returning empty array');
      return [];
    }

    const snapshot = await this.db
      .ref('messages')
      .limitToLast(limit)
      .orderByChild('timestamp')
      .equalTo(userId)
      .once('value');

    const data = snapshot.val();
    if (!data) {
      console.log('No data found');
      return [];
    }

    const messages = Object.entries(data)
      .map(([key, value]: [string, any]) => {
        return new Message(
          key,
          value.content,
          value.role,
          value.userId,
          new Date(value.timestamp),
        );
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(offset, offset + limit)
      .reverse();

    console.log('Found messages:', messages.length);
    console.log('==================');

    return messages;
  }

  async deleteById(id: string): Promise<void> {
    await this.db.ref('messages').child(id).remove();
  }
}
