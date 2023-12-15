import { PrismaClient, Prisma } from '@prisma/client';
import { type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { ErrorHandler } from '../../utilities/errors/error-handler';

const prisma = new PrismaClient();

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { username, email, password, roleId } = req.body;
  const hashedPassword = await bcrypt.hash(password as string, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roleId,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      next(new ErrorHandler(400, 'A user with this email already exists.'));
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
): Promise<void> => {
  const { id } = req.params;
  const { username, email, roleId } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { username, email, roleId },
    });

    res.status(200).json(updatedUser);
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

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: Number(id) },
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
