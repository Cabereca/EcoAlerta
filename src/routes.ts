/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import path from 'path';
import { Router } from 'express';
import userRoutes from './routes/userRoutes';
import employeeRoutes from './routes/employeeRoutes';
import occurrenceRoutes from './routes/occurrenceRoutes';
import { userLogin, employeeLogin } from './controllers/loginController';

const routes = Router();

routes.post('/userLogin', userLogin);
routes.post('/employeeLogin', employeeLogin);
routes.use('/users', userRoutes);
routes.use('/employee', employeeRoutes);
routes.use('/occurrence', occurrenceRoutes);

routes.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

export default routes;
