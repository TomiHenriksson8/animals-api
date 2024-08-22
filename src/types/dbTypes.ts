import {Types} from 'mongoose';

export interface Species {
  id: string;
  species_name: string;
  category: Types.ObjectId;
  image: string;
  location: {
    type: 'Point'; // GeoJSON Point type
    coordinates: [number, number];
  };
}

export interface Category {
  id: string;
  category_name: string;
}

export interface Animal {
  id: string;
  animal_name: string;
  birthdate: Date;
  species: Types.ObjectId;
  location: {
    type: string;
    coordinates: number[];
  };
  owner: string;
}
