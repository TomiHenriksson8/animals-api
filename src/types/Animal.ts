import {Types} from 'mongoose';
import {Point} from 'geojson';

export interface Animal {
  animal_name: string;
  birthdate: Date;
  species: Types.ObjectId;
  location: Point;
}
