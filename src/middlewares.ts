import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import * as jwt from 'jsonwebtoken';
import { decodeToken } from '@utils/jwt';
import { PrismaClient } from '@prisma/client';

const SIGN_KEY = '+VeB_u9v97Tf+P_k>]m[L}4+zCV5e5{;ZWFS)m*';

const prisma = new PrismaClient();

// local
export const localsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return next();
  // res.locals.loggedIn = Boolean(req.session.loggedIn);
  // res.locals.siteName = 'Shubug';
  // res.locals.loggedInUser = req.session.user || {};
  // next();
};

// secure
export const protectorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return next();
  // if (req.session.loggedIn) {
  //   return next();
  // } else {
  //   return res.redirect('/login');
  // }
};

// public
export const publicOnlyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return next();
  // if (!req.session.loggedIn) {
  //   return next();
  // } else {
  //   return res.redirect('/');
  // }
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.cookies;
  const { accessToken } = req.query;

  try {
    // refresh token -> access token 유효성 검사
    const isValid = jwt.verify(accessToken || refreshToken, SIGN_KEY) as {
      [key: string]: any;
    };

    const user = await prisma.user.findUnique({
      where: { id: isValid.userId },
    });
    // 존재하지 않는 사용자
    if (!user) return res.status(400).json({ message: 'No Such User Found' });

    // req.user = user;
    return next();
  } catch {
    // 토큰 만료
    return res.status(401).json({ message: 'Invalid Token' });
  }
};

// user avatar img upload
export const avatarUpload = multer({
  dest: 'uploads/avatars/',
  limits: {
    fileSize: 3000000,
  },
});
