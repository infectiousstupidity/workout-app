import { type Request, type Response, type NextFunction } from 'express';
import * as workoutService from './workout-service';
import {
  createWorkoutSchema,
  updateWorkoutSchema,
  deleteWorkoutSchema,
  getExerciseProgressSchema,
  removeExerciseFromProgramSchema,
  createWorkoutProgramSchema,
  updateWorkoutProgramSchema,
  createWorkoutScheduleSchema,
  updateWorkoutScheduleSchema,
  scheduleIdSchema,
} from './workout-validation';
import { ErrorHandler } from '../../utilities/errors/error-handler';
import { ZodError } from 'zod';
import logger from '../../utilities/logger/logger';

export const createWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData = createWorkoutSchema.parse(req.body);
    const newWorkout = await workoutService.createWorkout(validatedData);
    res.status(201).json(newWorkout);
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error('Validation error creating workout', { error });
      res.status(400).json({ error: error.flatten() });
    } else {
      logger.error('Error creating workout in controller', { error });
      next(new ErrorHandler(500, 'Internal Server Error'));
    }
  }
};

export const listWorkouts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workouts = await workoutService.listWorkouts();
    res.status(200).json(workouts);
  } catch (error) {
    logger.error('Error getting workouts in controller', { error });
    next(new ErrorHandler(500, 'Internal Server Error'));
  }
};

export const updateWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updateWorkoutSchema.parse(req.body);
    const updatedWorkout = await workoutService.updateWorkout(
      Number(id),
      validatedData,
    );
    res.status(200).json(updatedWorkout);
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error('Validation error updating workout', { error });
      res.status(400).json({ error: error.flatten() });
    } else {
      logger.error('Error updating workout in controller', { error });
      next(new ErrorHandler(500, 'Internal Server Error'));
    }
  }
};

export const deleteWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = deleteWorkoutSchema.parse({ id: Number(req.params.id) });
    await workoutService.deleteWorkout(params.id);
    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    logger.error('Error deleting workout in controller', { error });
    next(new ErrorHandler(500, 'Internal Server Error'));
  }
};

export const removeExerciseFromProgram = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = removeExerciseFromProgramSchema.parse(req.params);
    await workoutService.removeExerciseFromProgram(
      params.programId,
      params.exerciseId,
    );
    res
      .status(200)
      .json({ message: 'Exercise removed from program successfully' });
  } catch (error) {
    logger.error('Error removing exercise from program', { error });
    next(new ErrorHandler(500, 'Internal Server Error'));
  }
};

export const getExerciseProgress = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = getExerciseProgressSchema.parse(req.params);
    const progressData = await workoutService.getExerciseProgress(
      params.userId,
      params.exerciseId,
    );
    res.status(200).json(progressData);
  } catch (error) {
    logger.error('Error fetching exercise progress', { error });
    next(new ErrorHandler(500, 'Internal Server Error'));
  }
};

export const createWorkoutProgram = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData = createWorkoutProgramSchema.parse(req.body);
    const newProgram = await workoutService.createWorkoutProgram(validatedData);
    res.status(201).json(newProgram);
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error('Validation error creating workout program', { error });
      res.status(400).json({ error: error.flatten() });
    } else {
      logger.error('Error creating workout program in controller', { error });
      next(new ErrorHandler(500, 'Internal Server Error'));
    }
  }
};

export const updateWorkoutProgram = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (req.params.id === undefined) {
      throw new ErrorHandler(400, 'Missing workout program ID');
    }
    const programId = parseInt(req.params.id);
    const validatedData = updateWorkoutProgramSchema.parse(req.body);
    const updatedProgram = await workoutService.updateWorkoutProgram(
      programId,
      validatedData,
    );
    res.status(200).json(updatedProgram);
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error('Validation error updating workout program', { error });
      res.status(400).json({ error: error.flatten() });
    } else {
      logger.error('Error updating workout program in controller', { error });
      next(new ErrorHandler(500, 'Internal Server Error'));
    }
  }
};

export const createWorkoutSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const scheduleData = createWorkoutScheduleSchema.parse(req.body);
    const schedule = await workoutService.createWorkoutSchedule(scheduleData);
    res.status(201).json(schedule);
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error('Validation error creating workout schedule', { error });
      res.status(400).json({ error: error.flatten() });
    } else {
      logger.error('Error creating workout schedule in controller', { error });
      next(new ErrorHandler(500, 'Internal Server Error'));
    }
  }
};

export const updateWorkoutSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const scheduleIdParams = scheduleIdSchema.parse(req.params);
    const scheduleData = updateWorkoutScheduleSchema.parse(req.body);
    const updatedSchedule = await workoutService.updateWorkoutSchedule(
      parseInt(scheduleIdParams.id),
      scheduleData,
    );
    res.status(200).json(updatedSchedule);
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error('Validation error updating workout schedule', { error });
      res.status(400).json({ error: error.flatten() });
    } else {
      logger.error('Error updating workout schedule in controller', { error });
      next(new ErrorHandler(500, 'Internal Server Error'));
    }
  }
};

export const deleteWorkoutSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const scheduleIdParams = scheduleIdSchema.parse(req.params);
    await workoutService.deleteWorkoutSchedule(parseInt(scheduleIdParams.id));
    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error('Validation error deleting workout schedule', { error });
      res.status(400).json({ error: error.flatten() });
    } else {
      logger.error('Error deleting workout schedule in controller', { error });
      next(new ErrorHandler(500, 'Internal Server Error'));
    }
  }
};
