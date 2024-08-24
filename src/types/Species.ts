import {Types} from 'mongoose';
import {Point} from 'geojson';

export interface Species {
  species_name: string;
  category: Types.ObjectId;
  image: string;
  location: Point;
}
