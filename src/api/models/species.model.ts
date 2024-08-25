import mongoose from 'mongoose';
import {Species, SpeciesModel} from '../../types/Species';
import {Polygon} from 'geojson';

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

speciesModel.statics.findByArea = async function (
  polygon: Polygon,
): Promise<Species[]> {
  console.log('Polygon in Model:', JSON.stringify(polygon, null, 2));

  return this.find({
    location: {
      $geoWithin: {
        $geometry: {
          type: 'Polygon',
          coordinates: polygon.coordinates,
        },
      },
    },
  }).exec();
};

export default mongoose.model<Species, SpeciesModel>('Species', speciesModel);
