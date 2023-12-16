import { type RequestHandler } from 'express';
import passport from 'passport';
import { type User } from '@prisma/client'; // Import User type from Prisma

export const authenticateJwt: RequestHandler = (req, res, next) =>
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error | null, user: User | null, info: unknown) => {
      if (err != null || user == null) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = user;
      next();
    },
  )(req, res, next);
