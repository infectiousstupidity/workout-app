import { type User } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as UserModel from './user-model';

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
  roleId: number;
}): Promise<User> => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await UserModel.createUser({ ...userData, password: hashedPassword });
};

export const getUser = async (id: number): Promise<User | null> => {
  return await UserModel.findUserById(id);
};

export const listUsers = async (): Promise<User[]> => {
  return await UserModel.findAllUsers();
};

export const editUser = async (
  id: number,
  userData: { username?: string; email?: string; roleId?: number },
): Promise<void> => {
  await UserModel.updateUserById(id, userData);
};

export const removeUser = async (id: number): Promise<void> => {
  await UserModel.deleteUserById(id);
};
