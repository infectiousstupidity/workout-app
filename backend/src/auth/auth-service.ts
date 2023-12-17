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

interface UserRegistrationResponse {
  id: number;
  username: string;
  email: string;
  roleId: number;
}

export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<UserRegistrationResponse> => {
  logger.info('Registering user', { email, username });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roleId: 1, // Hint to self: Make sure user role is id 1 in the database
      },
      select: {
        id: true,
        username: true,
        email: true,
        roleId: true,
      },
    });
    logger.info('Registration successful', {
      userId: newUser.id,
      username: newUser.username,
    });
    return newUser;
  } catch (error) {
    logger.error('Registration failed', { email, username, error });
    throw error;
  }
};
