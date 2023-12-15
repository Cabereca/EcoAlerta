/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import employeeController from '../controllers/employeeController';
import { adminMiddleware } from '../middlewares/adminMiddleware';

const router = Router();

router.get('/:id', adminMiddleware, employeeController.show);
router.post('/', employeeController.store);
router.put('/:id', adminMiddleware, employeeController.update);
router.delete('/:id', adminMiddleware, employeeController.destroy);

export default router;
