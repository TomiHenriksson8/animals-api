import {Types, Document, Model} from 'mongoose';
import {Point, Polygon} from 'geojson';

export interface Species extends Document {
  species_name: string;
  category: Types.ObjectId;
  image: string;
  location: Point;
}

export interface SpeciesModel extends Model<Species> {
  findByArea(polygon: Polygon): Promise<Species[]>
}
