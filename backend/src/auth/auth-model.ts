import { PrismaClient, type User, type Role } from '@prisma/client';
import logger from '../utilities/logger/logger';

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    logger.error('Error finding user by email in model', { error, email });
    throw error;
  }
};

export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
  roleId: number;
}): Promise<User> => {
  try {
    return await prisma.user.create({ data: userData });
  } catch (error) {
    logger.error('Error creating user in model', {
      error,
      email: userData.email,
    });
    throw error;
  }
};

export const findUserById = async (id: number): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    logger.error('Error finding user by ID in model', { error, id });
    throw error;
  }
};

export const findRoleByName = async (
  roleName: string,
): Promise<Role | null> => {
  try {
    return await prisma.role.findUnique({ where: { name: roleName } });
  } catch (error) {
    logger.error('Error finding role by name', { error, roleName });
    throw error;
  }
};
