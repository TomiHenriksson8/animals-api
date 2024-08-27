import {Types, Document, Model} from 'mongoose';
import {Point, Polygon} from 'geojson';
import { Category } from './Category';

export interface Species extends Document {
  _id: string
  species_name: string;
  category: Types.ObjectId | Category;
  image: string;
  location: Point;
}

export interface SpeciesModel extends Model<Species> {
  findByArea(polygon: Polygon): Promise<Species[]>
}
