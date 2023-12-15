/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { userController } from '../controllers/userController';
import { userMiddleware } from '../middlewares/userMiddleware';

const routes = Router();

routes.get('/', userController.findAllUsers);
routes.get('/:email', userMiddleware, userController.findUser);
routes.post('/', userController.createUser);
routes.put('/:email', userMiddleware, userController.updateUser);
routes.delete('/:email', userMiddleware, userController.deleteUser);

export default routes;
