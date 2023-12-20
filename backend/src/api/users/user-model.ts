import { PrismaClient, type User, type Role } from '@prisma/client';
import logger from '../../utilities/logger/logger';

const prisma = new PrismaClient();

export const findUserById = async (id: number): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    logger.info('User model: User found by ID', { userId: id });
    return user;
  } catch (error) {
    logger.error('Error finding user by ID in model', { error, userId: id });
    throw error;
  }
};

export const findAllUsers = async (): Promise<User[]> => {
  try {
    const users = await prisma.user.findMany();
    logger.info('User model: All users fetched');
    return users;
  } catch (error) {
    logger.error('Error fetching all users in model', { error });
    throw error;
  }
};

export const updateUserById = async (
  id: number,
  userData: Partial<User>,
): Promise<User> => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
    });
    logger.info('User model: User updated', { userId: id });
    return updatedUser;
  } catch (error) {
    logger.error('Error updating user in model', { error, userId: id });
    throw error;
  }
};

export const deleteUserById = async (id: number): Promise<User> => {
  try {
    const deletedUser = await prisma.user.delete({ where: { id } });
    logger.info('User model: User deleted', { userId: id });
    return deletedUser;
  } catch (error) {
    logger.error('Error deleting user in model', { error, userId: id });
    throw error;
  }
};

export const findRoleByName = async (
  roleName: string,
): Promise<Role | null> => {
  try {
    const role = await prisma.role.findFirst({ where: { name: roleName } });
    logger.info('User model: Role found by name', { roleName });
    return role;
  } catch (error) {
    logger.error('Error finding role by name in model', { error, roleName });
    throw error;
  }
};
