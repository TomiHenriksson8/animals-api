import mongoose, {Schema} from 'mongoose';
import {Category} from '../types/dbTypes';

const categorySchema: Schema<Category> = new mongoose.Schema({
  category_name: {type: String, required: true, minLenght: 2},
});

export default mongoose.model('Category', categorySchema);
