import { type Request, type Response, type NextFunction } from 'express';
import * as AuthService from './auth-service';
import logger from '../utilities/logger/logger';
import { loginSchema, registerSchema } from './auth-validation';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const token = await AuthService.authenticate(
      validatedData.email,
      validatedData.password,
    );
    if (token != null) {
      logger.info('Login successful', { email: validatedData.email });
      res.json({ token });
    } else {
      logger.warn('Invalid credentials', { email: validatedData.email });
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    logger.error('Error in login', { error });
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await AuthService.register(
      validatedData.username,
      validatedData.email,
      validatedData.password,
    );
    logger.info('Registration successful', {
      email: validatedData.email,
      username: validatedData.username,
    });
    res.status(201).json(user);
  } catch (error) {
    logger.error('Error in registration', { error });
    next(error);
  }
};
