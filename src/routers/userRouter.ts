import express from 'express';
import { findId, login, signup, verifyLogged } from '@controllers/userController';
import {  publicOnlyMiddleware } from 'middlewares';

const userRouter = express.Router();

userRouter.route('/signup').all(publicOnlyMiddleware).post(signup); // 회원가입
userRouter.route('/login').all(publicOnlyMiddleware).post(login); // 로그인
userRouter.route('/find-id').all(publicOnlyMiddleware).post(findId); // 아이디 찾기

//userRouter.route('/logged').all(authMiddleware).get(verifyLogged);

export default userRouter;


