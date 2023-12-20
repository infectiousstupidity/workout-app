import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string(),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username should be at least 3 characters long')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username should only contain letters, numbers, and underscores',
    ),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password should be at least 8 characters long')
    .regex(/[a-z]/, 'Password should contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password should contain at least one uppercase letter')
    .regex(/\d/, 'Password should contain at least one number')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password should contain at least one special character',
    ),
});
