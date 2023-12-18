import { type Exercise } from '@prisma/client';
import logger from '../../utilities/logger/logger';
import * as ExerciseModel from './exercise-model';

export const createExercise = async (exerciseData: {
  name: string;
  description: string;
  userId: number;
}): Promise<Exercise> => {
  logger.info('Creating new exercise', {
    name: exerciseData.name,
    userId: exerciseData.userId,
  });
  const newExercise = await ExerciseModel.createExercise(exerciseData);
  logger.info('Exercise created successfully', { exerciseId: newExercise.id });
  return newExercise;
};

export const getExercise = async (id: number): Promise<Exercise | null> => {
  logger.info('Getting exercise by ID', { id });
  return await ExerciseModel.findExerciseById(id);
};

export const listExercisesByUser = async (
  userId: number,
): Promise<Exercise[]> => {
  logger.info('Listing all exercises for user', { userId });
  return await ExerciseModel.findAllExercisesByUserId(userId);
};

export const editExercise = async (
  id: number,
  exerciseData: { name?: string; description?: string },
): Promise<void> => {
  logger.info('Editing exercise', { id, updatedData: exerciseData });
  await ExerciseModel.updateExerciseById(id, exerciseData);
  logger.info('Exercise updated successfully', { id });
};

export const removeExercise = async (id: number): Promise<void> => {
  logger.info('Removing exercise', { id });
  await ExerciseModel.deleteExerciseById(id);
  logger.info('Exercise removed successfully', { id });
};
