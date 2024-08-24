import express from 'express';
import {
  deleteCategory,
  getCategories,
  getCategory,
  postCategory,
  updateCategory,
} from '../controllers/categoryController';

const router = express.Router();

router.route('/').post(postCategory).get(getCategories);

router.route('/:id').get(getCategory).put(updateCategory).delete(deleteCategory);

export default router;
