import express from 'express';
import rootRouter from '@routers/rootRouter';
import userRouter from '@routers/userRouter';
import { localsMiddleware } from 'middlewares';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express();

// cors
app.use(cors({ origin: ['http://localhost:3000'] }));

// middleware로 뺄 예정
// logger & pug
const logger = morgan('dev');
app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(logger);
app.use(express.urlencoded({ extended: true }));
// cookie parsing
app.use(cookieParser());
// json body parsing
app.use(bodyParser.json()); // json parsing
app.use(bodyParser.urlencoded({ extended: true })); // html from parsing
// middleware로 뺄 예정

app.use(localsMiddleware); // local middleware
app.use('/uploads', express.static('uploads')); // upload files
app.use('/', rootRouter); // root
app.use('/users', userRouter); // user

export default app;
