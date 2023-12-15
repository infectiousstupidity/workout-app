import { PrismaClient, Prisma } from '@prisma/client';
import { type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { ErrorHandler } from '../../utilities/errors/error-handler';
import {
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
} from './user-validation';
import { ZodError } from 'zod';

const prisma = new PrismaClient();

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        roleId: validatedData.roleId,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.flatten() });
    } else {
      next(new ErrorHandler(500, 'Internal Server Error'));
    }
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  try {
    const validatedData = updateUserSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        username: validatedData.username,
        email: validatedData.email,
        roleId: validatedData.roleId,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.flatten() });
    } else if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2001'
    ) {
      res.status(404).json({ error: 'User not found' });
    } else {
      next(new ErrorHandler(500, 'Internal Server Error'));
    }
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = deleteUserSchema.parse({ id: Number(req.params.id) });

    await prisma.user.delete({
      where: { id: params.id },
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2001'
    ) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};
