import {NextFunction, Request, Response} from 'express';
import {Category} from '../../types/Category';
import {MessageResponse} from '../../types/Messages';
import categoryModel from '../models/category.model';
import CustomError from '../../classes/CustomError';

type DBMessageResponse = MessageResponse & {
  data: Category | Category[];
};

export const getCategories = async (
  req: Request,
  res: Response<Category[]>,
  next: NextFunction,
) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const postCategory = async (
  req: Request<{}, Category>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const newCategory = new categoryModel(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json({
      message: 'Category created',
      data: savedCategory,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const getCategory = async (
  req: Request<{id: string}>,
  res: Response<Category>,
  next: NextFunction,
) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      throw new CustomError('Category not found', 404);
    }
    res.status(200).json(category)
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const updateCategory = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true},
    );
    if (!updatedCategory) {
      throw new CustomError('Category not found', 404)
    }
    res.status(200).json({
      message: 'Category Updated',
      data: updatedCategory
    })
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const deleteCategory = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction
) => {
  try {
    const deletedCategory = await categoryModel.findByIdAndDelete(
      req.params.id,
    )
    if (!deletedCategory) {
      throw new CustomError('Category not found', 404);
    }
    res.status(200).json({
      message: 'Category deleted',
      data: deletedCategory
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};
