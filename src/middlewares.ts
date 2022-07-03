import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

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

// user avatar img upload
export const avatarUpload = multer({
  dest: 'uploads/avatars/',
  limits: {
    fileSize: 3000000,
  },
});
