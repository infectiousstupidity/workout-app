import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import logger from '../utilities/logger/logger';

const secretKey = process.env.JWT_SECRET ?? 'your-secret-key';
const prisma = new PrismaClient();

export const authenticate = async (
  email: string,
  password: string,
): Promise<string | null> => {
  logger.info('Authenticating user', { email });
  const user = await prisma.user.findUnique({ where: { email } });
  if (user != null && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    logger.info('Authentication successful', { userId: user.id });
    return token;
  }
  logger.warn('Authentication failed', { email });
  return null;
};
