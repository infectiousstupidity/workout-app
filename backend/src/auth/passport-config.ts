import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient, type User } from '@prisma/client';
import logger from '../utilities/logger/logger';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET ?? 'your-secret-key',
};

const prisma = new PrismaClient();

const findUser = async (id: number): Promise<User | null> => {
  try {
    logger.info('Finding user for JWT', { userId: id });
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    logger.error('Error finding user for JWT', { error });
    return null;
  }
};

passport.use(
  new JwtStrategy(options, (jwtPayload, done) => {
    findUser(Number(jwtPayload.userId))
      .then((user) => {
        if (user != null) {
          logger.info('User found for JWT', { userId: jwtPayload.userId });
          done(null, user);
        } else {
          logger.warn('User not found for JWT', { userId: jwtPayload.userId });
          done(null, false);
        }
      })
      .catch((error) => {
        logger.error('Error in JWT strategy', { error });
        done(error, false);
      });
  }),
);

export default passport;
