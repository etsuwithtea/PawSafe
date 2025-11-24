import express, { Request, Response } from 'express';
import { CompletedLostPet } from '../models/CompletedLostPet.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImageFile = (imagePath: string) => {
  try {
    const filePath = path.join(__dirname, '../../', imagePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Image deleted:', filePath);
    }
  } catch (error) {
    console.error('Error deleting image file:', error);
  }
};

const router = express.Router();

router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit)) || 12));
    const skip = (pageNum - 1) * limitNum;

    const filter = { contactUserId: userId };
    const total = await CompletedLostPet.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    const completedLostPets = await CompletedLostPet.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      data: completedLostPets,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get user completed lost pets error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching user completed lost pets' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit)) || 12));
    const skip = (pageNum - 1) * limitNum;

    const total = await CompletedLostPet.countDocuments();
    const totalPages = Math.ceil(total / limitNum);

    const completedLostPets = await CompletedLostPet.find()
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      data: completedLostPets,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get completed lost pets error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching completed lost pets' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const completedLostPet = await CompletedLostPet.findById(req.params.id).lean();

    if (!completedLostPet) {
      res.status(404).json({ success: false, message: 'Completed lost pet not found' });
      return;
    }

    res.status(200).json({ success: true, data: completedLostPet });
  } catch (error) {
    console.error('Get completed lost pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching completed lost pet' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const completedLostPet = await CompletedLostPet.findByIdAndDelete(req.params.id);

    if (!completedLostPet) {
      res.status(404).json({ success: false, message: 'Completed lost pet not found' });
      return;
    }

    // Delete all associated images
    if (completedLostPet.images && completedLostPet.images.length > 0) {
      completedLostPet.images.forEach((imagePath: string) => {
        deleteImageFile(imagePath);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Completed lost pet deleted successfully',
    });
  } catch (error) {
    console.error('Delete completed lost pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting completed lost pet' });
  }
});

export default router;
