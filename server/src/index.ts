import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import chatRoutes from './routes/chat.js';
import petsRoutes from './routes/pets.js';
import lostPetsRoutes from './routes/lostPets.js';
import completedPetsRoutes from './routes/completedPets.js';
import completedLostPetsRoutes from './routes/completedLostPets.js';
import { setupSocketHandlers } from './socket/socketHandlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/lost-pets', lostPetsRoutes);
app.use('/api/completed-pets', completedPetsRoutes);
app.use('/api/completed-lost-pets', completedLostPetsRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ message: 'File size too large. Max 5MB allowed.' });
  } else if (err.message === 'Only image files are allowed') {
    res.status(400).json({ message: err.message });
  } else {
    next(err);
  }
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Create HTTP server and Socket.IO instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Setup Socket.IO handlers
setupSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});
