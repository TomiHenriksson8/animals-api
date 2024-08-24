import mongoose from 'mongoose';
import {Species} from '../../types/Species';

const speciesModel = new mongoose.Schema<Species>({
  species_name: {type: String, required: true, minglength: 2},
  image: {type: String, required: true},
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
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

speciesModel.index({location: '2dsphere'});

export default mongoose.model<Species>('Species', speciesModel);
