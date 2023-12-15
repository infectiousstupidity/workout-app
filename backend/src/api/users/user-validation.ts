import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(3, 'Username should be at least 3 characters long'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password should be at least 8 characters long')
    .regex(/[a-zA-Z]/, 'Password should contain letters')
    .regex(/\d/, 'Password should contain numbers'),
  roleId: z.number(),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  roleId: z.number().optional(),
});

export const deleteUserSchema = z.object({
  id: z.number(),
});
