import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { SIGN_KEY } from '@utils/jwt';

const prisma = new PrismaClient();

// 회원가입
export const signup = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const password = await bcrypt.hash(req.body.password, 10);
  const user = await prisma.user.create({
    data: { name, email, password },
  });

  const accessToken = jwt.sign({ userId: user.id }, SIGN_KEY);

  return res.json({ accessToken, user });
};

// 로그인
export const login = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return res.status(400).json({ message: 'No Such User Found' });

  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(400).json({ message: 'Invalid Password' });

  const accessToken = jwt.sign({ userId: user.id }, SIGN_KEY);

  return res.status(200).json({ accessToken, user });
};
