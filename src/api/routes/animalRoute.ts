import express, {Request, Response} from 'express';
import {
  deleteAnimal,
  getAnimal,
  getAnimals,
  getAnimalsBySpecies,
  getAnimalsFromArea,
  postAnimal,
  updateAnimal,
} from '../controllers/animalController';

const router = express.Router();

router.route('/').post(postAnimal).get(getAnimals);

router.get('/location', getAnimalsFromArea);

router.route('/:id').get(getAnimal).put(updateAnimal).delete(deleteAnimal);

router.get('/species/:species', getAnimalsBySpecies);

export default router;
