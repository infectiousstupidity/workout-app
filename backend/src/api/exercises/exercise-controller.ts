import { PrismaClient, Prisma } from '@prisma/client';
import { type Request, type Response, type NextFunction } from 'express';
import { ErrorHandler } from '../../utilities/errors/error-handler';
import {
  createExerciseSchema,
  updateExerciseSchema,
  deleteExerciseSchema,
} from './exercise-validation'; // Assume you have these schemas defined
import { ZodError } from 'zod';
import logger from '../../utilities/logger/logger';

const prisma = new PrismaClient();

export const createExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.info('Creating exercise', { body: req.body });
    const validatedData = createExerciseSchema.parse(req.body);

    const newExercise = await prisma.exercise.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        userId: validatedData.userId,
      },
    });

    res.status(201).json(newExercise);
  } catch (error) {
    logger.error('Error creating exercise', { error });
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.flatten() });
    } else {
      next(new ErrorHandler(500, 'Internal Server Error'));
    }
  }
};

export const getExercises = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    logger.info('Getting exercises', { body: req.body });
    const exercises = await prisma.exercise.findMany();
    res.status(200).json(exercises);
  } catch (error) {
    logger.error('Error getting exercises', { error });
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const updateExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  try {
    logger.info('Updating exercise', { body: req.body });
    const validatedData: {
      name?: string;
      description?: string;
      userId?: number;
    } = updateExerciseSchema.parse(req.body);

    const updatedExercise = await prisma.exercise.update({
      where: { id: Number(id) },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        userId: validatedData.userId,
      },
    });

    res.status(200).json(updatedExercise);
  } catch (error) {
    logger.error('Error updating exercise', { error });
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.flatten() });
    } else if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2001'
    ) {
      res.status(404).json({ error: 'Exercise not found' });
    } else {
      next(new ErrorHandler(500, 'Internal Server Error'));
    }
  }
};

export const deleteExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.info('Deleting exercise', { body: req.body });
    const params = deleteExerciseSchema.parse({ id: Number(req.params.id) });

    await prisma.exercise.delete({
      where: { id: params.id },
    });

    res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    logger.error('Error deleting exercise', { error });
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2001'
    ) {
      res.status(404).json({ error: 'Exercise not found' });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};
