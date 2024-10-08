import express from 'express';
import { deleteSpecies, findSpeciesInArea, getOneSpecies, getSpecies, getSpeciesFromBox, postSpecies, updateSpecies } from '../controllers/speciesController';
import { addImageToSpecies } from '../../middlewares';

const router = express.Router();

router.route('/').get(getSpecies).post(addImageToSpecies, postSpecies);

router.get('/location', getSpeciesFromBox)

router.post('/area', findSpeciesInArea)

router.route('/:id').get(getOneSpecies).put(updateSpecies).delete(deleteSpecies);

export default router;
