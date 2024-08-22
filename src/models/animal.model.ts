import mongoose, {Schema} from 'mongoose';
import {Animal} from '../types/dbTypes';

const animalSchema: Schema<Animal> = new mongoose.Schema({
  animal_name: {type: String, reuired: true, minlength: 2},
  birthdate: {type: Date},
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Species',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // GeoJSON 'Point'
      required: true,
    },
  },
  owner: {type: String, required: true},
});

export default mongoose.model('Animal', animalSchema);
