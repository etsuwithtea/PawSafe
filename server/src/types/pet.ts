import type { Document } from 'mongoose';

export interface IPet extends Document {
  name: string;
  species: 'dog' | 'cat' | 'other';
  age?: number;
  gender: 'male' | 'female' | 'unknown';
  status: 'available' | 'pending' | 'adopted';
  location: string;
  locationDetails: string;
  description: string;
  characteristics: string[];
  images: string[];
  contactUserId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  adoptionCount: number;
  savedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}
