import mongoose, { Types } from 'mongoose';
import { Animal, AnimalModel } from '../../types/Animal'; // Import the custom AnimalModel interface

const animalSchema = new mongoose.Schema<Animal>({
  animal_name: { type: String, required: true, minlength: 2 },
  birthdate: { type: Date },
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

animalSchema.index({ location: '2dsphere' });

animalSchema.statics.findBySpecies = async function (
  speciesId: string,
): Promise<Animal[]> {
  return this.find({ species: speciesId }).exec();
};

export default mongoose.model<Animal, AnimalModel>('Animal', animalSchema);
