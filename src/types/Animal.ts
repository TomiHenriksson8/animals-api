import {Document, Types, Model} from 'mongoose';
import {Point} from 'geojson';
import { Species } from './Species';

export interface Animal extends Document {
  animal_name: string;
  birthdate: Date;
  species: Types.ObjectId | Species;
  location: Point;
}

export interface AnimalModel extends Model<Animal> {
  findBySpecies(speciesId: string): Promise<Animal[]>
}
