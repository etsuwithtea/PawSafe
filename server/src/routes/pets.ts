import express, { Request, Response } from 'express';
import { Pet } from '../models/Pet.js';
import { CompletedPet } from '../models/CompletedPet.js';
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
    const { status = 'all', species = 'all', search = '', page = 1, limit = 12, province = '', district = '' } = req.query;

    const filter: any = {};
    
    if (status !== 'all') {
      filter.status = status;
    }
    
    if (species !== 'all') {
      filter.species = species;
    }

    if (search && typeof search === 'string' && search.trim()) {
      // Search in name, description, characteristics, and locationDetails
      const searchRegex = { $regex: search, $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { locationDetails: searchRegex },
        { characteristics: searchRegex }
      ];
    }

    // Filter by province and district
    if (province && typeof province === 'string' && province.trim()) {
      filter.location = { $regex: province, $options: 'i' };
    }

    if (district && typeof district === 'string' && district.trim()) {
      if (filter.location) {
        // If both province and district are specified, combine them
        filter.location = { $regex: `${district}.*${province}|${province}.*${district}`, $options: 'i' };
      } else {
        filter.location = { $regex: district, $options: 'i' };
      }
    }

    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit)) || 12));
    const skip = (pageNum - 1) * limitNum;

    const total = await Pet.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    const pets = await Pet.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      data: pets,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching pets' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const pet = await Pet.findById(req.params.id).lean();

    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found' });
      return;
    }

    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching pet' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, species, age, gender, location, locationDetails, description, characteristics, images, contactUserId, contactName, contactPhone, contactEmail } = req.body;

    if (!name || !species || !location || !description || !contactUserId || !contactName) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    const newPet = new Pet({
      name,
      species,
      age: age || null,
      gender: gender || 'unknown',
      location,
      locationDetails: locationDetails || '',
      description,
      characteristics: characteristics || [],
      images: images || [],
      contactUserId,
      contactName,
      contactPhone,
      contactEmail,
      status: 'available',
    });

    await newPet.save();

    res.status(201).json({
      success: true,
      message: 'Pet created successfully',
      data: newPet,
    });
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating pet' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, species, age, gender, location, locationDetails, description, characteristics, images, status } = req.body;

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found' });
      return;
    }

    // Check if status changed to 'adopted' BEFORE updating - move to completed
    const oldStatus = pet.status;
    if (status === 'adopted' && oldStatus !== 'adopted') {
      // Create a completed pet record with updated data
      const completedPet = new CompletedPet({
        name: name !== undefined ? name : pet.name,
        species: species !== undefined ? species : pet.species,
        age: age !== undefined ? age : pet.age,
        gender: gender !== undefined ? gender : pet.gender,
        status: 'adopted',
        location: location !== undefined ? location : pet.location,
        locationDetails: locationDetails !== undefined ? locationDetails : pet.locationDetails,
        description: description !== undefined ? description : pet.description,
        characteristics: characteristics !== undefined ? characteristics : pet.characteristics,
        images: images !== undefined ? images : pet.images,
        contactUserId: pet.contactUserId,
        contactName: pet.contactName,
        contactPhone: pet.contactPhone,
        contactEmail: pet.contactEmail,
        adoptionCount: pet.adoptionCount,
        savedBy: pet.savedBy,
      });

      await completedPet.save();

      // Delete from Pet collection
      await Pet.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Pet marked as adopted and moved to completed posts',
        data: completedPet,
      });
      return;
    }

    if (name !== undefined) pet.name = name;
    if (species !== undefined) pet.species = species;
    if (age !== undefined) pet.age = age;
    if (gender !== undefined) pet.gender = gender;
    if (location !== undefined) pet.location = location;
    if (locationDetails !== undefined) pet.locationDetails = locationDetails;
    if (description !== undefined) pet.description = description;
    if (characteristics !== undefined) pet.characteristics = characteristics;
    if (images !== undefined) pet.images = images;
    if (status !== undefined) pet.status = status;

    await pet.save();

    res.status(200).json({
      success: true,
      message: 'Pet updated successfully',
      data: pet,
    });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating pet' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);

    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found' });
      return;
    }

    // Delete all associated images
    if (pet.images && pet.images.length > 0) {
      pet.images.forEach((imagePath: string) => {
        deleteImageFile(imagePath);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pet deleted successfully',
    });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting pet' });
  }
});

router.post('/:id/save', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found' });
      return;
    }

    if (!pet.savedBy.includes(userId)) {
      pet.savedBy.push(userId);
      await pet.save();
    }

    res.status(200).json({
      success: true,
      message: 'Pet saved successfully',
      data: pet,
    });
  } catch (error) {
    console.error('Save pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while saving pet' });
  }
});

router.post('/:id/unsave', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found' });
      return;
    }

    pet.savedBy = pet.savedBy.filter((id: string) => id !== userId);
    await pet.save();

    res.status(200).json({
      success: true,
      message: 'Pet removed from saved',
      data: pet,
    });
  } catch (error) {
    console.error('Unsave pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while removing pet from saved' });
  }
});

export default router;
