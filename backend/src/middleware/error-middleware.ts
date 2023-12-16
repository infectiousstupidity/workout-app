import { type Request, type Response, type NextFunction } from 'express';
import { type ErrorHandler } from '../utilities/errors/error-handler';
import logger from '../utilities/logger/logger';

export const handleError = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode ?? 500;
  logger.error('Error handled', {
    statusCode,
    message: err.message,
    stack: err.stack,
  });
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message,
  });
};
