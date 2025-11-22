import mongoose, { Schema } from 'mongoose';
import type { IMessage } from '../types/message.js';

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
      default: 'Anonymous',
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ conversationId: 1, timestamp: -1 });
export const Message = mongoose.model<IMessage>('Message', messageSchema);