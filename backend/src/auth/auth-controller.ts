import { type Request, type Response, type NextFunction } from 'express';
import * as AuthService from './auth-service';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    const token = await AuthService.authenticate(email, password);
    if (token !== undefined && token !== null) {
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
};
