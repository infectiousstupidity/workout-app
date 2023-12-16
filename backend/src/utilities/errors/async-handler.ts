import { type Request, type Response, type NextFunction } from 'express';
import logger from '../logger/logger';

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      logger.error('Error in async handler', { error: err });
      next(err);
    });
  };
