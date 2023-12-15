import { type Request, type Response, type NextFunction } from 'express';
import { type ErrorHandler } from '../utilities/errors/error-handler';

export const handleError = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message,
  });
};
