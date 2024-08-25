import {NextFunction, Request, Response} from 'express';
import {MessageResponse} from '../../types/Messages';
import {Animal} from '../../types/Animal';
import CustomError from '../../classes/CustomError';
import animalModel from '../models/animal.model';

type DBMessageResponse = MessageResponse & {
  data: Animal | Animal[];
};

export const getAnimals = async (
  req: Request,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const animals = await animalModel.find();
    res.status(200).json({
      message: 'Animals retrieved',
      data: animals,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const getAnimal = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const animal = await animalModel.findById(req.body.id);
    if (!animal) {
      throw new CustomError('Animal not found', 404);
    }
    res.status(200).json({
      message: 'Animal retrieved',
      data: animal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const postAnimal = async (
  req: Request<{}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const newAnimal = new animalModel(req.body);
    const savedAnimal = await newAnimal.save();
    res.status(200).json({
      message: 'Animal posted',
      data: savedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const updateAnimal = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const updatedAnimal = await animalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true},
    );
    if (!updatedAnimal) {
      throw new CustomError('Animal not found', 404);
    }
    res.status(200).json({
      message: '',
      data: updatedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const deleteAnimal = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const deletedAnimal = await animalModel.findByIdAndDelete(req.params.id);
    if (!deletedAnimal) {
      throw new CustomError('Animal not found', 404);
    }
    res.status(200).json({
      message: 'Animal deleted',
      data: deletedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const getAnimalsFromArea = async (
  req: Request,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const {topRight, bottomLeft} = req.query;
    if (!topRight || !bottomLeft) {
      throw new CustomError('Please provide both topRight and bottomLeft', 400);
    }
    const [topRightLat, topRightLon] = (topRight as string)
      .split(',')
      .map(Number);
    const [bottomLeftLat, bottomLeftLon] = (bottomLeft as string)
      .split(',')
      .map(Number);

    const boundingBox = [
      [bottomLeftLon, bottomLeftLat],
      [topRightLon, topRightLat],
    ];

    const animalsInArea = await animalModel.find({
      location: {
        $geoWithin: {
          $box: boundingBox,
        },
      },
    });

    res.status(200).json({
      message: 'Animals in area',
      data: animalsInArea,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const getAnimalsBySpecies = async (
  req: Request<{species: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const { species } = req.params
    const animals = await animalModel.findBySpecies(species);

    if (!animals.length) {
      throw new CustomError('No animals found', 404)
    }
    res.status(200).json({
      message: 'Animals retrieved',
      data: animals
    })

  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};
