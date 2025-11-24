import type { Document } from 'mongoose';

export interface ILostPet extends Document {
  name: string;
  species: 'dog' | 'cat' | 'other';
  age?: number;
  gender: 'male' | 'female' | 'unknown';
  status: 'lost' | 'found' | 'returned';
  location: string;
  locationDetails: string;
  lostDate: Date;
  description: string;
  characteristics: string[];
  images: string[];
  contactUserId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  savedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}
