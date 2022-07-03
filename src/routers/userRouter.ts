import express from 'express';
import { login, signup } from '@controllers/userController';
import { publicOnlyMiddleware } from 'middlewares';

const userRouter = express.Router();

userRouter.route('/signup').all(publicOnlyMiddleware).post(signup); // 회원가입
userRouter.route('/login').all(publicOnlyMiddleware).post(login); // 로그인

export default userRouter;
