import express, { Request, Response } from 'express';
import { Message } from '../models/Message.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { conversationId, since } = req.query;

    if (!conversationId || typeof conversationId !== 'string') {
      return res.status(400).json({ error: 'conversationId is required' });
    }

    let query: any = { conversationId };

    if (since && typeof since === 'string') {
      const sinceDate = new Date(parseInt(since));
      query.timestamp = { $gt: sinceDate };
    }

    const messages = await Message.find(query)
      .sort({ timestamp: 1 })
      .lean()
      .exec();

    const processedMessages = messages.map((msg: any) => {
      let senderName = 'Anonymous';
      
      if (msg.senderName) {
        if (typeof msg.senderName === 'string') {
          senderName = msg.senderName;
        } else if (typeof msg.senderName === 'object' && msg.senderName._id) {
          senderName = msg.senderName._id;
        }
      }
      
      return {
        ...msg,
        senderName,
      };
    });

    res.json({
      messages: processedMessages,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { conversationId, senderId, senderName, text } = req.body;

    if (!conversationId || !senderId || !text) {
      return res.status(400).json({
        error: 'conversationId, senderId, and text are required',
      });
    }

    const message = new Message({
      conversationId,
      senderId,
      senderName: senderName && typeof senderName === 'string' ? senderName : 'Anonymous',
      text,
      timestamp: new Date(),
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: message.toObject(),
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

router.get('/conversations', async (req: Request, res: Response) => {
  try {
    const conversations = await Message.distinct('conversationId');
    res.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

export default router;
