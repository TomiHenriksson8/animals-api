import express, {Request, Response} from 'express';
import animalModel from '../models/animal.model';

const router = express.Router();

// get all the animals
router.get('/', async (req: Request, res: Response) => {
  try {
    const animals = await animalModel.find();
    res.json(animals);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({error: error.message});
    }
    res.status(500).json({message: 'an unknown error occurred'});
  }
});

export default router;
