import { type User } from '@prisma/client';
import bcrypt from 'bcrypt';
import logger from '../../utilities/logger/logger';
import * as UserModel from './user-model';

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
  roleId: number;
}): Promise<User> => {
  logger.info('Registering new user', {
    username: userData.username,
    email: userData.email,
  });
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const registeredUser = await UserModel.createUser({
    ...userData,
    password: hashedPassword,
  });
  logger.info('User registered successfully', { userId: registeredUser.id });
  return registeredUser;
};

export const getUser = async (id: number): Promise<User | null> => {
  logger.info('Getting user by ID', { id });
  return await UserModel.findUserById(id);
};

export const listUsers = async (): Promise<User[]> => {
  logger.info('Listing all users');
  return await UserModel.findAllUsers();
};

export const editUser = async (
  id: number,
  userData: { username?: string; email?: string; roleId?: number },
): Promise<void> => {
  logger.info('Editing user', { id, updatedData: userData });
  await UserModel.updateUserById(id, userData);
  logger.info('User updated successfully', { id });
};

export const removeUser = async (id: number): Promise<void> => {
  logger.info('Removing user', { id });
  await UserModel.deleteUserById(id);
  logger.info('User removed successfully', { id });
};
