import { type Request, type Response, type NextFunction } from 'express';
import * as AuthService from './auth-service';
import logger from '../utilities/logger/logger';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    logger.info('Login attempt', { email });
    const token = await AuthService.authenticate(email, password);
    if (token !== undefined && token !== null) {
      logger.info('Login successful', { email });
      res.json({ token });
    } else {
      logger.warn('Invalid credentials', { email });
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
    const {
      username,
      email,
      password,
    }: { username: string; email: string; password: string } = req.body;
    logger.info('Register attempt', { email, username });
    const user = await AuthService.register(username, email, password);
    if (user != null) {
      logger.info('Registration successful', { email, username });
      res.status(201).json(user);
    } else {
      logger.warn('Registration failed', { email, username });
      res.status(400).send('Registration failed');
    }
  } catch (error) {
    logger.error('Error in registration', { error });
    next(error);
  }
};
