/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { userController } from '../controllers/userController';
import { userMiddleware } from '../middlewares/authUserMiddleware';
import { validateUserMiddleware } from '../middlewares/validateUserMiddleware';

const routes = Router();

routes.get('/', userMiddleware, userController.findUser);
routes.post('/', validateUserMiddleware, userController.createUser);
routes.put('/', userMiddleware, userController.updateUser);
routes.delete('/', userMiddleware, userController.deleteUser);

export default routes;
