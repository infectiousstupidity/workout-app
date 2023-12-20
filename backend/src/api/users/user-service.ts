import * as UserModel from './user-model';
import { type User } from '@prisma/client';
import logger from '../../utilities/logger/logger';
import { type UserUpdatePayload } from './user-types';

export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const user = await UserModel.findUserById(id);
    logger.info('User service: User retrieved', { userId: id });
    return user;
  } catch (error) {
    logger.error('Error getting user by ID in service', { error });
    throw error;
  }
};

export const listAllUsers = async (): Promise<User[]> => {
  try {
    const users = await UserModel.findAllUsers();
    logger.info('User service: All users listed');
    return users;
  } catch (error) {
    logger.error('Error listing all users in service', { error });
    throw error;
  }
};

export const updateUser = async (
  id: number,
  userData: UserUpdatePayload,
): Promise<User> => {
  try {
    const updatedUser = await UserModel.updateUserById(id, userData);
    logger.info('User service: User updated', { userId: id });
    return updatedUser;
  } catch (error) {
    logger.error('Error updating user in service', { error });
    throw error;
  }
};

export const deleteUser = async (id: number): Promise<User> => {
  try {
    const deletedUser = await UserModel.deleteUserById(id);
    logger.info('User service: User deleted', { userId: id });
    return deletedUser;
  } catch (error) {
    logger.error('Error deleting user in service', { error });
    throw error;
  }
};
