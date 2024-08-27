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
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const animals = await animalModel
      .find()
      .select('-__v')
      .populate({
        path: 'species',
        select: 'species_name category',
        populate: {path: 'category', select: 'category_name'},
      });
    res.status(200).json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const getAnimal = async (
  req: Request<{id: string}>,
  res: Response<Animal>,
  next: NextFunction,
) => {
  try {
    const animals = await animalModel
      .findById(req.params.id)
      .select('-__v')
      .populate({
        path: 'species',
        select: 'species_name category',
        populate: {path: 'category', select: 'category_name'},
      });
    if (!animals) {
      return res.status(404);
    }
    res.status(200).json(animals);
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
    res.status(201).json({
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
  req: Request<{}, {}, {}, {topRight: string; bottomLeft: string}>,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const {topRight, bottomLeft} = req.query;
    if (!topRight || !bottomLeft) {
      throw new CustomError('Please provide both topRight and bottomLeft', 400);
    }

    const animalsInArea = await animalModel
      .find({
        location: {
          $geoWithin: {
            $box: [topRight.split(','), bottomLeft.split(',')],
          },
        },
      })
      .select('-__v')
      .populate({
        path: 'species',
        select: 'species_name category',
        populate: {path: 'category', select: 'category_name'},
      });
    res.status(200).json(animalsInArea);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const getAnimalsBySpecies = async (
  req: Request<{species: string}>,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const {species} = req.params;
    const animals = await animalModel.findBySpecies(species);
    res.status(200).json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};
