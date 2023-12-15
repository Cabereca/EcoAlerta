import 'express-async-errors';
import express from 'express';
import routes from './routes';
import cors from 'cors';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/error';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(cors());

app.use(routes);

app.use(errorMiddleware);

export default app;
