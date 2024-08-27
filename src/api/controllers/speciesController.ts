import {NextFunction, Request, Response} from 'express';
import {MessageResponse} from '../../types/Messages';
import {Species} from '../../types/Species';
import CustomError from '../../classes/CustomError';
import speciesModel from '../models/species.model';
import {Polygon} from 'geojson';
import geojsonValidation from 'geojson-validation';

type DBMessageResponse = MessageResponse & {
  data: Species | Species[];
};

export const getSpecies = async (
  req: Request,
  res: Response<Species[]>,
  next: NextFunction,
) => {
  try {
    const species = await speciesModel.find();
    res.status(200).json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const getOneSpecies = async (
  req: Request<{id: string}>,
  res: Response<Species>,
  next: NextFunction,
) => {
  try {
    const species = await speciesModel.findById(req.params.id);
    if (!species) {
      throw new CustomError('Species not found', 404);
    }
    res.status(200).json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const postSpecies = async (
  req: Request<{}, Species>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const newSpecies = new speciesModel(req.body);
    const savedSpecies = await newSpecies.save();
    res.status(201).json({
      message: 'Species created',
      data: savedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const updateSpecies = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const updatedSpecies = await speciesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true},
    );
    if (!updatedSpecies) {
      throw new CustomError('Species not found', 404);
    }
    res.status(200).json({
      message: 'Species updated',
      data: updatedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const deleteSpecies = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const deletedSpecies = await speciesModel.findByIdAndDelete(req.params.id);
    if (!deletedSpecies) {
      throw new CustomError('Species not found', 404);
    }
    res.status(200).json({
      message: 'Species deleted',
      data: deletedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const getSpeciesFromBox = async (
  req: Request<{}, {}, {}, {topRight: string; bottomLeft: string}>,
  res: Response<Species[]>,
  next: NextFunction,
) => {
  try {
    const {topRight, bottomLeft} = req.query;
    if (!topRight || !bottomLeft) {
      throw new CustomError('Please provide both topRight and bottomLeft', 400);
    }

    const speciesInArea = await speciesModel.find({
      location: {
        $geoWithin: {
          $box: [topRight.split(','), bottomLeft.split(',')],
        },
      },
    });

    res.status(200).json(speciesInArea);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const findSpeciesInArea = async (
  req: Request,
  res: Response<Species[]>,
  next: NextFunction
) => {
  try {
    const polygon = req.body.polygon || req.body;

    console.log('Request Body:', req.body);
    console.log('Extracted Polygon:', polygon);

    if (!polygon || !geojsonValidation.isPolygon(polygon)) {
      throw new CustomError('Invalid GeoJSON polygon provided', 400);
    }

    const speciesInArea = await speciesModel.findByArea(polygon);

    if (!speciesInArea || speciesInArea.length === 0) {
      throw new CustomError('No species found in the specified area', 404);
    }
    res.status(200).json(speciesInArea);
  } catch (error) {
    console.error('Error in findSpeciesInArea:', error);
    next(new CustomError((error as Error).message, 500));
  }
};
