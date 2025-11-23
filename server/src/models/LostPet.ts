import mongoose, { Schema } from 'mongoose';
import type { ILostPet } from '../types/index.js';

const lostPetSchema = new Schema<ILostPet>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    species: {
      type: String,
      enum: ['dog', 'cat', 'other'],
      required: true,
    },
    age: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unknown'],
      default: 'unknown',
    },
    status: {
      type: String,
      enum: ['lost', 'returned'],
      default: 'lost',
      index: true,
    },
    location: {
      type: String,
      required: true,
    },
    locationDetails: {
      type: String,
      default: '',
    },
    lostDate: {
      type: Date,
      default: new Date(),
    },
    description: {
      type: String,
      required: true,
    },
    characteristics: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    contactUserId: {
      type: String,
      required: true,
      index: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    savedBy: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

lostPetSchema.index({ name: 'text', description: 'text' });
lostPetSchema.index({ status: 1, createdAt: -1 });

export const LostPet = mongoose.model<ILostPet>('LostPet', lostPetSchema);
