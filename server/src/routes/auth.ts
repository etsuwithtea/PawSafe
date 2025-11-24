import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    if (user.status !== 'active') {
      res.status(403).json({ message: 'User account is not active' });
      return;
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        ...userWithoutPassword,
        _id: user._id.toString(),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, email, password, phone, address } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'Username, email and password are required' });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone: phone || '',
      address: address || '',
      role: 'user',
      status: 'active',
    });

    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        ...userWithoutPassword,
        _id: newUser._id.toString(),
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

export default router;
