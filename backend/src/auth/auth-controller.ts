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
