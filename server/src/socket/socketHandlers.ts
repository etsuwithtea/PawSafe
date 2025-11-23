import { Server, Socket } from 'socket.io';
import { Message } from '../models/Message.js';

// Store active user connections
const activeUsers = new Map<string, string>(); // userId -> socketId
const userSocketMap = new Map<string, string>(); // socketId -> userId

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // User joins with their user ID
    socket.on('user_join', (userId: string) => {
      activeUsers.set(userId, socket.id);
      userSocketMap.set(socket.id, userId);
      console.log(`User ${userId} joined with socket ${socket.id}`);
      io.emit('active_users', Array.from(activeUsers.keys()));
    });

    // Join a conversation room
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(conversationId);
      console.log(`Socket ${socket.id} left conversation ${conversationId}`);
    });

    // Handle incoming messages
    socket.on('send_message', async (data: {
      conversationId: string;
      senderId: string;
      senderName: string;
      text: string;
    }, callback?: (ack: any) => void) => {
      try {
        // Save message to database
        const message = new Message({
          conversationId: data.conversationId,
          senderId: data.senderId,
          senderName: data.senderName,
          text: data.text,
          timestamp: new Date(),
        });

        await message.save();

        const messageData = {
          _id: message._id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          senderName: message.senderName,
          text: message.text,
          timestamp: message.timestamp,
        };

        // Send acknowledgment back to sender
        if (callback) {
          callback({ success: true, message: messageData });
        }

        // Broadcast to all users in the conversation room (including sender)
        io.to(data.conversationId).emit('receive_message', messageData);

        console.log(`Message sent in conversation ${data.conversationId}`);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('message_error', { message: 'Failed to send message' });
        if (callback) {
          callback({ success: false, message: 'Failed to send message' });
        }
      }
    });

    // Handle typing indicator
    socket.on('user_typing', (data: { conversationId: string; senderName: string }) => {
      socket.to(data.conversationId).emit('typing_indicator', {
        senderName: data.senderName,
        isTyping: true,
      });
    });

    // Handle typing stop
    socket.on('user_stop_typing', (conversationId: string) => {
      socket.to(conversationId).emit('typing_indicator', {
        isTyping: false,
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const userId = userSocketMap.get(socket.id);
      if (userId) {
        activeUsers.delete(userId);
        userSocketMap.delete(socket.id);
        console.log(`User ${userId} disconnected`);
        io.emit('active_users', Array.from(activeUsers.keys()));
      }
    });
  });
}
