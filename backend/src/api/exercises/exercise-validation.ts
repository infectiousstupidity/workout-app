import { z } from 'zod';

export const createExerciseSchema = z.object({
  name: z.string().min(3, 'Exercise name should be at least 3 characters long'),
  description: z.string().optional(),
  userId: z.number(),
});

export const updateExerciseSchema = z.object({
  name: z
    .string()
    .min(3, 'Exercise name should be at least 3 characters long')
    .optional(),
  description: z.string().optional(),
});

export const deleteExerciseSchema = z.object({
  id: z.number(),
});
