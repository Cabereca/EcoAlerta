/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { userController } from '../controllers/userController';
import { userMiddleware } from '../middlewares/userMiddleware';

const routes = Router();

routes.get('/', userController.findAllUsers);
routes.get('/:id', userMiddleware, userController.findUser);
routes.post('/', userController.createUser);
routes.put('/:id', userMiddleware, userController.updateUser);
routes.delete('/:id', userMiddleware, userController.deleteUser);

export default routes;
