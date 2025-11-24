import mongoose, { Schema } from 'mongoose';
import type { IPet } from '../types/index.js';

const completedPetSchema = new Schema<IPet>(
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
      enum: ['adopted'],
      default: 'adopted',
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
    adoptionCount: {
      type: Number,
      default: 0,
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

completedPetSchema.index({ name: 'text', description: 'text' });
completedPetSchema.index({ contactUserId: 1, createdAt: -1 });

export const CompletedPet = mongoose.model<IPet>('CompletedPet', completedPetSchema);
