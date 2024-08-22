import mongoose, {Schema} from 'mongoose';
import {Species} from '../types/dbTypes';

const speciesSchema: Schema<Species> = new mongoose.Schema({
  species_name: {type: String, required: true, minlength: 2},
  image: {type: String, required: true},
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // GeoJSON 'Point'
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

export default mongoose.model('Species', speciesSchema);
