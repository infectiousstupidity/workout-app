import { PrismaClient, type User } from '@prisma/client';
import logger from '../../utilities/logger/logger';

const prisma = new PrismaClient();

export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
  roleId: number;
}): Promise<User> => {
  logger.info('Creating user in database', {
    username: userData.username,
    email: userData.email,
  });
  const user = await prisma.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      roleId: userData.roleId,
    },
  });
  logger.info('User created in database', { userId: user.id });
  return user;
};

export const findUserById = async (id: number): Promise<User | null> => {
  logger.info('Finding user by ID', { id });
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const findAllUsers = async (): Promise<User[]> => {
  logger.info('Fetching all users');
  return await prisma.user.findMany();
};

export const updateUserById = async (
  id: number,
  userData: Partial<User>,
): Promise<User> => {
  logger.info('Updating user', { id, updatedData: userData });
  return await prisma.user.update({
    where: { id },
    data: userData,
  });
};

export const deleteUserById = async (id: number): Promise<User> => {
  logger.info('Deleting user', { id });
  return await prisma.user.delete({
    where: { id },
  });
};
