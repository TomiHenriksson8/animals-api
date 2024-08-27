import mongoose, {Types} from 'mongoose';
import {Animal, AnimalModel} from '../../types/Animal'; // Import the custom AnimalModel interface
import speciesModel from './species.model';

const animalSchema = new mongoose.Schema<Animal>({
  animal_name: {type: String, required: true, minlength: 2},
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

animalSchema.statics.findBySpecies = async function (
  speciesName: string,
): Promise<Animal[]> {
  const species = await speciesModel.findOne({ species_name: speciesName }).exec();

  if (!species) {
    return [];
  }
  return this.find({ species: species._id })
    .populate({
      path: 'species',
      select: 'species_name category',
      populate: { path: 'category', select: 'category_name' },
    })
    .select('-__v')
    .exec();
};

export default mongoose.model<Animal, AnimalModel>('Animal', animalSchema);
