import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  type VerifiedCallback,
} from 'passport-jwt';
import { PrismaClient } from '@prisma/client';
import logger from '../utilities/logger/logger';
import { type Request } from 'express';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET ?? 'your-secret-key',
  passReqToCallback: true,
};

const prisma = new PrismaClient();

passport.use(
  new JwtStrategy(
    options,
    (req: Request, jwtPayload: { userId: number }, done: VerifiedCallback) => {
      prisma.user
        .findUnique({
          where: { id: jwtPayload.userId },
        })
        .then((user) => {
          if (user != null) {
            req.user = user;
            logger.info('User found for JWT', { userId: user.id });
            done(null, user);
          } else {
            logger.warn('User not found for JWT', {
              userId: jwtPayload.userId,
            });
            done(null, false);
          }
        })
        .catch((error) => {
          logger.error('Error in JWT strategy', { error });
          done(error, false);
        });
    },
  ),
);

export default passport;
