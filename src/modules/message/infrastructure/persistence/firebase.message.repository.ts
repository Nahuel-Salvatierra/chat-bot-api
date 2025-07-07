import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

import { MessageRepository } from '../../application/repository/message.repository.interface';
import { Message } from '../../domain/message.entity';

@Injectable()
export class FirebaseMessageRepository implements MessageRepository {
  private readonly db: admin.firestore.Firestore;

  constructor(private readonly configService: ConfigService) {
    const firebaseConfig = this.configService.get('firebase');

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseConfig.projectId,
          clientEmail: firebaseConfig.clientEmail,
          privateKey: firebaseConfig.privateKey,
        }),
      });

      this.db = admin.firestore();
    }
    this.db = admin.firestore();
  }

  async create(message: Message): Promise<Message> {
    const messageData = {
      id: message.id,
      content: message.content,
      role: message.role,
      userId: message.userId,
      createdAt: new Date(),
    };

    const filteredData = Object.fromEntries(
      Object.entries(messageData).filter(([, value]) => value !== undefined),
    );

    const docRef = this.db.collection('messages').doc(message.id);
    await docRef.set(filteredData);

    return new Message(
      message.id,
      message.content,
      message.role,
      message.userId,
      message.timestamp,
    );
  }

  async findMany(userId: string): Promise<Message[]> {
    const limit = 10;
    const offset = 0;
    if (!userId) {
      return [];
    }

    const snapshot = await this.db
      .collection('messages')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset)
      .get();

    const messages = snapshot.docs.map((doc) => {
      const data = doc.data();

      return new Message(
        doc.id,
        data.content,
        data.role,
        data.userId,
        new Date(data.createdAt?.toDate()),
      );
    });

    return messages.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    );
  }
}
