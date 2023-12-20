import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as AuthModel from './auth-model';
import logger from '../utilities/logger/logger';
import { type User } from '@prisma/client';

const secretKey = process.env.JWT_SECRET ?? 'your-secret-key';

export const authenticate = async (
  email: string,
  password: string,
): Promise<string | null> => {
  logger.info('Authenticating user', { email });
  const user = await AuthModel.findUserByEmail(email);
  if (user != null && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    logger.info('Authentication successful', { userId: user.id });
    return token;
  }
  logger.warn('Authentication failed', { email });
  return null;
};

export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<User> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = await AuthModel.findRoleByName('user');
    if (role == null) throw new Error('Default user role not found');

    return await AuthModel.createUser({
      username,
      email,
      password: hashedPassword,
      roleId: role.id,
    });
  } catch (error) {
    logger.error('Registration failed', { email, username, error });
    throw error;
  }
};
