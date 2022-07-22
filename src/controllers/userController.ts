import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { decodeToken, SIGN_KEY } from '@utils/jwt';
import { nextTick } from 'process';

const prisma = new PrismaClient();

// 회원가입
export const signup = async (req: Request, res: Response) => {
  const { avatar, email, name, phoneNum } = req.body;
  const password = await bcrypt.hash(req.body.password, 10);
  const user = await prisma.user.create({
    data: { email, password, ...(avatar && { avatar }), name, phoneNum },
  });

  const accessToken = jwt.sign({ userId: user.id }, SIGN_KEY, {
    expiresIn: "30s", // 10초
  });

  const refreshToken = jwt.sign({ userId: user.id }, SIGN_KEY, {
    expiresIn:"30d" , // 30일
  });
  res.cookie('refreshToken', refreshToken); // 이게 맞나?

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

  const accessToken = jwt.sign({ userId: user.id }, SIGN_KEY, {
    expiresIn: 30, // 10초
  });

  const refreshToken = jwt.sign({ userId: user.id }, SIGN_KEY, {
    expiresIn:"30d" , // 30일
  });
  res.cookie('refreshToken', refreshToken); // res.cookie나오고 return 나와도 되나?

  return res.status(200).json({ accessToken, user });
};

// 아이디 찾기
export const findId = async (req: Request, res: Response) => {
  const { phoneNum } = req.body;
  const user = await prisma.user.findUnique({
    where: { phoneNum },
  });

  if (!user) return res.status(400).json({ message: 'No Such User Found' });

  const { email } = user;
  return res.status(200).json({ email });
};

// access token & refresh token 유효성 검사
export const verifyLogged = async (req: Request, res: Response) => {
res.status(200).json({message: 'Valid Token'});
}

//access token 이랑 요청된 데이터 보내주기

//

