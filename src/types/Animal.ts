import {Document, Types, Model} from 'mongoose';
import {Point} from 'geojson';

export interface Animal extends Document {
  animal_name: string;
  birthdate: Date;
  species: Types.ObjectId;
  location: Point;
}

export interface AnimalModel extends Model<Animal> {
  findBySpecies(speciesId: string): Promise<Animal[]>
}
