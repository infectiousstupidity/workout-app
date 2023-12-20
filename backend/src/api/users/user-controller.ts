import { type Request, type Response, type NextFunction } from 'express';
import * as UserService from './user-service';
import { updateUserSchema, deleteUserSchema } from './user-validation';
import { ErrorHandler } from '../../utilities/errors/error-handler';
import { ZodError } from 'zod';
import logger from '../../utilities/logger/logger';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await UserService.listAllUsers();
    res.status(200).json(users);
  } catch (error) {
    logger.error('Error getting users in controller', { error });
    next(new ErrorHandler(500, 'Internal Server Error'));
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updateUserSchema.parse(req.body);
    const updatedUser = await UserService.updateUser(Number(id), validatedData);
    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error('Error updating user in controller', { error });
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.flatten() });
    } else {
      next(new ErrorHandler(500, 'Internal Server Error'));
    }
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = deleteUserSchema.parse({ id: Number(req.params.id) });
    await UserService.deleteUser(params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Error deleting user in controller', { error });
    next(new ErrorHandler(500, 'Internal Server Error'));
  }
};
