import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const secretKey = process.env.JWT_SECRET ?? 'your-secret-key';
const prisma = new PrismaClient();

export const authenticate = async (
  email: string,
  password: string,
): Promise<string | null> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user != null && bcrypt.compareSync(password, user.password)) {
    return jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
  }
  return null;
};
