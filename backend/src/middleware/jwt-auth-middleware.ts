import { type RequestHandler } from 'express';
import passport from 'passport';
import { type User } from '@prisma/client';
import logger from '../utilities/logger/logger';

export const authenticateJwt: RequestHandler = (req, res, next) =>
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error | null, user: User | null, info: unknown) => {
      if (err != null || user == null) {
        logger.warn('JWT authentication failed', { error: err, info });
        return res.status(401).json({ message: 'Unauthorized' });
      }
      logger.info('JWT authentication successful', { userId: user.id });
      req.user = user;
      next();
    },
  )(req, res, next);
