import { PrismaClient, type Workout } from '@prisma/client';
import logger from '../../utilities/logger/logger';

const prisma = new PrismaClient();

export const createWorkout = async (workoutData: {
  name: string;
  userId: number;
  exerciseId: number;
}): Promise<Workout> => {
  try {
    logger.info('Creating workout in database', {
      name: workoutData.name,
      userId: workoutData.userId,
      exerciseId: workoutData.exerciseId,
    });
    const workout = await prisma.workout.create({
      data: {
        name: workoutData.name,
        userId: workoutData.userId,
        exerciseId: workoutData.exerciseId,
      },
    });
    logger.info('Workout created in database', { workoutId: workout.id });
    return workout;
  } catch (error) {
    logger.error('Error creating workout in model', { error });
    throw error;
  }
};

export const findWorkoutById = async (id: number): Promise<Workout | null> => {
  try {
    logger.info('Finding workout by ID', { id });
    return await prisma.workout.findUnique({
      where: { id },
      include: { user: true },
    });
  } catch (error) {
    logger.error('Error finding workout by ID in model', { error });
    throw error;
  }
};

export const findAllWorkouts = async (): Promise<Workout[]> => {
  try {
    logger.info('Fetching all workouts');
    return await prisma.workout.findMany();
  } catch (error) {
    logger.error('Error fetching all workouts in model', { error });
    throw error;
  }
};

export const updateWorkoutById = async (
  id: number,
  workoutData: Partial<Workout>,
): Promise<Workout> => {
  try {
    logger.info('Updating workout', { id, updatedData: workoutData });
    return await prisma.workout.update({
      where: { id },
      data: workoutData,
    });
  } catch (error) {
    logger.error('Error updating workout in model', { error });
    throw error;
  }
};

export const deleteWorkoutById = async (id: number): Promise<Workout> => {
  try {
    logger.info('Deleting workout', { id });
    return await prisma.workout.delete({
      where: { id },
    });
  } catch (error) {
    logger.error('Error deleting workout in model', { error });
    throw error;
  }
};
