import express, { Request, Response } from 'express';
import { CompletedPet } from '../models/CompletedPet.js';
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
    const total = await CompletedPet.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    const completedPets = await CompletedPet.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      data: completedPets,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get user completed pets error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching user completed pets' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit)) || 12));
    const skip = (pageNum - 1) * limitNum;

    const total = await CompletedPet.countDocuments();
    const totalPages = Math.ceil(total / limitNum);

    const completedPets = await CompletedPet.find()
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      data: completedPets,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get completed pets error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching completed pets' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const completedPet = await CompletedPet.findById(req.params.id).lean();

    if (!completedPet) {
      res.status(404).json({ success: false, message: 'Completed pet not found' });
      return;
    }

    res.status(200).json({ success: true, data: completedPet });
  } catch (error) {
    console.error('Get completed pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching completed pet' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const completedPet = await CompletedPet.findByIdAndDelete(req.params.id);

    if (!completedPet) {
      res.status(404).json({ success: false, message: 'Completed pet not found' });
      return;
    }

    // Delete all associated images
    if (completedPet.images && completedPet.images.length > 0) {
      completedPet.images.forEach((imagePath: string) => {
        deleteImageFile(imagePath);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Completed pet deleted successfully',
    });
  } catch (error) {
    console.error('Delete completed pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting completed pet' });
  }
});

export default router;
