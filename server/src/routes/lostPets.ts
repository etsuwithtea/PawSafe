import express, { Request, Response } from 'express';
import { LostPet } from '../models/LostPet.js';
import { uploadPetImages } from '../middleware/uploadMiddleware.js';
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

router.post('/upload-images', uploadPetImages.array('images', 5), async (req: Request, res: Response) => {
  try {
    if (!req.files || req.files.length === 0) {
      res.status(400).json({ success: false, message: 'No images provided' });
      return;
    }

    const imagePaths = (req.files as Express.Multer.File[]).map(
      (file) => `/uploads/petImages/${file.filename}`
    );

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      images: imagePaths,
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ success: false, message: 'Server error while uploading images' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status = 'all', species = 'all', search = '', page = 1, limit = 12 } = req.query;

    const filter: any = {};
    
    if (status !== 'all') {
      filter.status = status;
    }
    
    if (species !== 'all') {
      filter.species = species;
    }

    if (search && typeof search === 'string' && search.trim()) {
      filter.$text = { $search: search };
    }

    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit)) || 12));
    const skip = (pageNum - 1) * limitNum;

    const total = await LostPet.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    const lostPets = await LostPet.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      data: lostPets,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get lost pets error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching lost pets' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const lostPet = await LostPet.findById(req.params.id).lean();

    if (!lostPet) {
      res.status(404).json({ success: false, message: 'Lost pet not found' });
      return;
    }

    res.status(200).json({ success: true, data: lostPet });
  } catch (error) {
    console.error('Get lost pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching lost pet' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, species, age, gender, location, locationDetails, lostDate, description, characteristics, images, contactUserId, contactName, contactPhone, contactEmail } = req.body;

    if (!name || !species || !location || !description || !contactUserId || !contactName || !contactPhone || !contactEmail) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    const newLostPet = new LostPet({
      name,
      species,
      age: age || null,
      gender: gender || 'unknown',
      location,
      locationDetails: locationDetails || '',
      lostDate: lostDate || new Date(),
      description,
      characteristics: characteristics || [],
      images: images || [],
      contactUserId,
      contactName,
      contactPhone,
      contactEmail,
      status: 'lost',
    });

    await newLostPet.save();

    res.status(201).json({
      success: true,
      message: 'Lost pet created successfully',
      data: newLostPet,
    });
  } catch (error) {
    console.error('Create lost pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating lost pet' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, species, age, gender, location, locationDetails, lostDate, description, characteristics, images, status } = req.body;

    const lostPet = await LostPet.findById(req.params.id);

    if (!lostPet) {
      res.status(404).json({ success: false, message: 'Lost pet not found' });
      return;
    }

    if (name !== undefined) lostPet.name = name;
    if (species !== undefined) lostPet.species = species;
    if (age !== undefined) lostPet.age = age;
    if (gender !== undefined) lostPet.gender = gender;
    if (location !== undefined) lostPet.location = location;
    if (locationDetails !== undefined) lostPet.locationDetails = locationDetails;
    if (lostDate !== undefined) lostPet.lostDate = lostDate;
    if (description !== undefined) lostPet.description = description;
    if (characteristics !== undefined) lostPet.characteristics = characteristics;
    if (images !== undefined) lostPet.images = images;
    if (status !== undefined) lostPet.status = status;

    await lostPet.save();

    res.status(200).json({
      success: true,
      message: 'Lost pet updated successfully',
      data: lostPet,
    });
  } catch (error) {
    console.error('Update lost pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating lost pet' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const lostPet = await LostPet.findByIdAndDelete(req.params.id);

    if (!lostPet) {
      res.status(404).json({ success: false, message: 'Lost pet not found' });
      return;
    }

    // Delete all associated images
    if (lostPet.images && lostPet.images.length > 0) {
      lostPet.images.forEach((imagePath: string) => {
        deleteImageFile(imagePath);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lost pet deleted successfully',
    });
  } catch (error) {
    console.error('Delete lost pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting lost pet' });
  }
});

router.post('/:id/save', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    const lostPet = await LostPet.findById(req.params.id);

    if (!lostPet) {
      res.status(404).json({ success: false, message: 'Lost pet not found' });
      return;
    }

    if (!lostPet.savedBy.includes(userId)) {
      lostPet.savedBy.push(userId);
      await lostPet.save();
    }

    res.status(200).json({
      success: true,
      message: 'Lost pet saved successfully',
      data: lostPet,
    });
  } catch (error) {
    console.error('Save lost pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while saving lost pet' });
  }
});

router.post('/:id/unsave', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    const lostPet = await LostPet.findById(req.params.id);

    if (!lostPet) {
      res.status(404).json({ success: false, message: 'Lost pet not found' });
      return;
    }

    lostPet.savedBy = lostPet.savedBy.filter((id: string) => id !== userId);
    await lostPet.save();

    res.status(200).json({
      success: true,
      message: 'Lost pet removed from saved',
      data: lostPet,
    });
  } catch (error) {
    console.error('Unsave lost pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while removing lost pet from saved' });
  }
});

export default router;
