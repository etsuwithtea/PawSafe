import type { Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  createdAt: Date;
}
