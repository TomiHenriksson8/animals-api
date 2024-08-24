import {NextFunction, Request, Response} from 'express';
import {MessageResponse} from '../../types/Messages';
import {Species} from '../../types/Species';
import CustomError from '../../classes/CustomError';
import speciesModel from '../models/species.model';

type DBMessageResponse = MessageResponse & {
  data: Species | Species[];
};

export const getSpecies = async (
  req: Request,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const species = await speciesModel.find();
    res.status(200).json({
      message: 'Species retrieved',
      data: species,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const getOneSpecies = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const species = await speciesModel.findById(req.params.id);
    if (!species) {
      throw new CustomError('Species not found', 404);
    }
    res.status(200).json({
      message: 'Species retrieved',
      data: species,
    });
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
    res.status(200).json({
      message: 'Species posted',
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

export const getSpeciesFromArea = async (
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

    const speciesInArea = await speciesModel.find({
      location: {
        $geoWithin: {
          $box: boundingBox,
        },
      },
    });

    res.status(200).json({
      message: 'Species from area',
      data: speciesInArea,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};
