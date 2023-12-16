import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient, type User } from '@prisma/client';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET ?? 'your-secret-key',
};

const prisma = new PrismaClient();

const findUser = async (id: number): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

passport.use(
  new JwtStrategy(options, (jwtPayload, done) => {
    findUser(Number(jwtPayload.userId))
      .then((user) => {
        if (user != null) {
          done(null, user);
        } else {
          done(null, false);
        }
      })
      .catch((error) => {
        done(error, false);
      });
  }),
);

export default passport;
