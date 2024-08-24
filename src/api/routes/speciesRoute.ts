import express from 'express';
import { deleteSpecies, getOneSpecies, getSpecies, getSpeciesFromArea, postSpecies, updateSpecies } from '../controllers/speciesController';

const router = express.Router();

router.route('/').get(getSpecies).post(postSpecies);

router.get('/location', getSpeciesFromArea)

router.route('/:id').get(getOneSpecies).put(updateSpecies).delete(deleteSpecies);

export default router;
