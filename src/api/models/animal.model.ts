import mongoose from 'mongoose';
import {Animal} from '../../types/Animal';

const animalSchema = new mongoose.Schema<Animal>({
  animal_name: {type: String, required: true, minglength: 2},
  birthdate: {type: Date},
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Species',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

animalSchema.index({location: '2dsphere'});

export default mongoose.model<Animal>('Animal', animalSchema);
