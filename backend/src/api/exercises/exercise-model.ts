import { PrismaClient, type Exercise } from '@prisma/client';
import logger from '../../utilities/logger/logger';

const prisma = new PrismaClient();

export const createExercise = async (exerciseData: {
  name: string;
  description: string;
  userId: number;
}): Promise<Exercise> => {
  logger.info('Creating exercise in database', {
    name: exerciseData.name,
    userId: exerciseData.userId,
  });
  const exercise = await prisma.exercise.create({
    data: {
      name: exerciseData.name,
      description: exerciseData.description,
      userId: exerciseData.userId,
    },
  });

  logger.info('Exercise created in database', { exerciseId: exercise.id });
  return exercise;
};

export const findExerciseById = async (
  id: number,
): Promise<Exercise | null> => {
  logger.info('Finding exercise by ID', { id });
  return await prisma.exercise.findUnique({
    where: { id },
    include: { user: true },
  });
};

export const findAllExercisesByUserId = async (
  userId: number,
): Promise<Exercise[]> => {
  logger.info('Fetching exercises for user', { userId });
  const userWithExercises = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      exercises: true,
    },
  });

  if (
    userWithExercises?.exercises !== undefined &&
    userWithExercises.exercises !== null
  ) {
    return userWithExercises.exercises;
  } else {
    return [];
  }
};

export const updateExerciseById = async (
  id: number,
  exerciseData: Partial<Exercise>,
): Promise<Exercise> => {
  logger.info('Updating exercise', { id, updatedData: exerciseData });
  return await prisma.exercise.update({
    where: { id },
    data: exerciseData,
  });
};

export const deleteExerciseById = async (id: number): Promise<Exercise> => {
  logger.info('Deleting exercise', { id });
  return await prisma.exercise.delete({
    where: { id },
  });
};
