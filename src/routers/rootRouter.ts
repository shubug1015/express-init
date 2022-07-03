import express from 'express';
import { publicOnlyMiddleware } from 'middlewares';

const rootRouter = express.Router();

rootRouter.route('/').all(publicOnlyMiddleware);

export default rootRouter;
