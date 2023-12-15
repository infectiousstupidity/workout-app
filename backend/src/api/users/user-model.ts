import { PrismaClient, type User } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
  roleId: number;
}): Promise<User> => {
  return await prisma.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      roleId: userData.roleId,
    },
  });
};

export const findUserById = async (id: number): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const findAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const updateUserById = async (
  id: number,
  userData: Partial<User>,
): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data: userData,
  });
};

export const deleteUserById = async (id: number): Promise<User> => {
  return await prisma.user.delete({
    where: { id },
  });
};
