import {
  PrismaClient,
  type Workout,
  type WorkoutHistory,
  type WorkoutProgram,
  type WorkoutSchedule,
} from '@prisma/client';
import logger from '../../utilities/logger/logger';

const prisma = new PrismaClient();

export const createWorkout = async (workoutData: {
  name: string;
  userId: number;
  exercises: Array<{
    exerciseId: number;
    sets: number;
    reps: number;
    initialWeight: number;
    incrementValue: number;
  }>;
}): Promise<Workout> => {
  logger.info('Creating workout in database', {
    name: workoutData.name,
    userId: workoutData.userId,
  });

  const workout = await prisma.workout.create({
    data: {
      name: workoutData.name,
      userId: workoutData.userId,
      workoutExercises: {
        create: workoutData.exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          initialWeight: exercise.initialWeight,
          incrementValue: exercise.incrementValue,
        })),
      },
    },
    include: {
      workoutExercises: {
        include: {
          exercise: true,
        },
      },
    },
  });

  logger.info('Workout created in database', { workoutId: workout.id });
  return workout;
};

export const listWorkouts = async (): Promise<Workout[]> => {
  logger.info('Fetching all workouts');
  return await prisma.workout.findMany();
};

export const findWorkoutById = async (id: number): Promise<Workout | null> => {
  logger.info('Finding workout by ID', { id });
  return await prisma.workout.findUnique({
    where: { id },
    include: {
      workoutExercises: {
        include: {
          exercise: true,
        },
      },
    },
  });
};

export const updateWorkout = async (
  id: number,
  workoutData: Partial<Workout>,
): Promise<Workout> => {
  logger.info('Updating workout', { id, updatedData: workoutData });
  return await prisma.workout.update({
    where: { id },
    data: workoutData,
  });
};

export const deleteWorkout = async (id: number): Promise<Workout> => {
  logger.info('Deleting workout', { id });
  return await prisma.workout.delete({
    where: { id },
  });
};

export const recordWorkoutHistory = async (workoutHistoryData: {
  workoutId: number;
  userId: number;
  performedAt: Date;
  sets: Array<{
    exerciseId: number;
    targetReps: number;
    actualReps: number;
    weight: number;
    date: Date;
  }>;
}): Promise<WorkoutHistory> => {
  logger.info('Recording workout history', {
    userId: workoutHistoryData.userId,
    workoutId: workoutHistoryData.workoutId,
  });
  const workoutHistory = await prisma.workoutHistory.create({
    data: {
      workoutId: workoutHistoryData.workoutId,
      userId: workoutHistoryData.userId,
      performedAt: workoutHistoryData.performedAt,
      sets: {
        create: workoutHistoryData.sets,
      },
    },
    include: {
      sets: true,
    },
  });
  logger.info('Workout history recorded', {
    workoutHistoryId: workoutHistory.id,
  });
  return workoutHistory;
};

export const createWorkoutProgram = async (programData: {
  name: string;
  userId: number;
  duration: number;
  programDays: Array<{ dayOfWeek: string; workoutId: number }>;
}): Promise<WorkoutProgram> => {
  logger.info('Creating workout program', {
    userId: programData.userId,
    name: programData.name,
  });
  const workoutProgram = await prisma.workoutProgram.create({
    data: {
      name: programData.name,
      userId: programData.userId,
      duration: programData.duration,
      programDays: {
        create: programData.programDays,
      },
    },
    include: {
      programDays: true,
    },
  });
  logger.info('Workout program created', {
    workoutProgramId: workoutProgram.id,
  });
  return workoutProgram;
};

export const updateWorkoutProgram = async (
  programId: number,
  updates: Partial<WorkoutProgram> & {
    programDays?: Array<{ dayOfWeek: string; workoutId: number }>;
  },
): Promise<WorkoutProgram> => {
  logger.info('Updating workout program', { programId });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {
    ...updates,
  };

  if (updates.programDays != null) {
    updateData.programDays = {
      updateMany: updates.programDays.map((day) => ({
        where: {
          workoutProgramId_dayOfWeek: {
            workoutProgramId: programId,
            dayOfWeek: day.dayOfWeek,
          },
        },
        data: {
          workoutId: day.workoutId,
        },
      })),
    };
  }

  const workoutProgram = await prisma.workoutProgram.update({
    where: { id: programId },
    data: updateData,
    include: {
      programDays: true,
    },
  });

  logger.info('Workout program updated', { workoutProgramId: programId });
  return workoutProgram;
};

export const removeExerciseFromProgram = async (
  programId: number,
  exerciseId: number,
): Promise<void> => {
  logger.info('Removing exercise from program', { programId, exerciseId });
  await prisma.workoutProgramExerciseProgress.deleteMany({
    where: {
      programId,
      exerciseId,
    },
  });
};

export const getExerciseProgress = async (
  userId: number,
  exerciseId: number,
): Promise<WorkoutHistory[]> => {
  logger.info('Fetching exercise progress', { userId, exerciseId });
  return await prisma.workoutHistory.findMany({
    where: {
      userId,
      sets: {
        some: {
          exerciseId,
        },
      },
    },
    include: {
      sets: true,
    },
  });
};

export const createWorkoutSchedule = async (scheduleData: {
  workoutId: number;
  userId: number;
  scheduledAt: Date;
  reminder: boolean;
}): Promise<WorkoutSchedule> => {
  try {
    const schedule = await prisma.workoutSchedule.create({
      data: scheduleData,
    });
    logger.info('Workout schedule created', { scheduleId: schedule.id });
    return schedule;
  } catch (error) {
    logger.error('Error creating workout schedule', { error });
    throw error;
  }
};

export const updateWorkoutSchedule = async (
  scheduleId: number,
  scheduleData: {
    scheduledAt?: Date;
    reminder?: boolean;
  },
): Promise<WorkoutSchedule> => {
  try {
    const updatedSchedule = await prisma.workoutSchedule.update({
      where: { id: scheduleId },
      data: scheduleData,
    });
    logger.info('Workout schedule updated', { scheduleId: updatedSchedule.id });
    return updatedSchedule;
  } catch (error) {
    logger.error('Error updating workout schedule', { error });
    throw error;
  }
};

export const deleteWorkoutSchedule = async (
  scheduleId: number,
): Promise<void> => {
  try {
    await prisma.workoutSchedule.delete({
      where: { id: scheduleId },
    });
    logger.info('Workout schedule deleted', { scheduleId });
  } catch (error) {
    logger.error('Error deleting workout schedule', { error });
    throw error;
  }
};
