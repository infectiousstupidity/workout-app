import { z } from 'zod';

export const createWorkoutSchema = z.object({
  name: z.string().min(3, 'Workout name should be at least 3 characters long'),
  userId: z.number(),
  exercises: z.array(
    z.object({
      exerciseId: z.number(),
      sets: z.number(),
      reps: z.number(),
      initialWeight: z.number(),
      incrementValue: z.number(),
    }),
  ),
});

export const updateWorkoutSchema = z.object({
  name: z
    .string()
    .min(3, 'Workout name should be at least 3 characters long')
    .optional(),
  userId: z.number(),
});

export const deleteWorkoutSchema = z.object({
  id: z.number(),
});

export const createWorkoutHistorySchema = z.object({
  workoutId: z.number(),
  userId: z.number(),
  performedAt: z.date(),
  sets: z.array(
    z.object({
      exerciseId: z.number(),
      targetReps: z.number(),
      actualReps: z.number(),
      weight: z.number(),
      date: z.date(),
    }),
  ),
});

export const createWorkoutProgramSchema = z.object({
  name: z.string().min(3, 'Program name should be at least 3 characters long'),
  userId: z.number(),
  duration: z.number(),
  programDays: z.array(
    z.object({
      dayOfWeek: z.string(),
      workoutId: z.number(),
      scheduledAt: z.date(),
    }),
  ),
});

export const updateWorkoutProgramSchema = z.object({
  name: z.string().min(3).optional(),
  duration: z.number().optional(),
  programDays: z
    .array(
      z.object({
        dayOfWeek: z.string(),
        workoutId: z.number(),
        scheduledAt: z.date(),
      }),
    )
    .optional(),
});

export const removeExerciseFromProgramSchema = z.object({
  programId: z.number(),
  exerciseId: z.number(),
});

export const getExerciseProgressSchema = z.object({
  userId: z.number(),
  exerciseId: z.number(),
});

export const createWorkoutScheduleSchema = z.object({
  workoutId: z.number(),
  userId: z.number(),
  scheduledAt: z.date(),
  reminder: z.boolean(),
});

export const updateWorkoutScheduleSchema = z.object({
  scheduledAt: z.date().optional(),
  reminder: z.boolean().optional(),
});

export const scheduleIdSchema = z.object({
  id: z.string(),
});
