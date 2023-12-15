/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import employeeController from '../controllers/employeeController';
import { adminMiddleware } from '../middlewares/adminMiddleware';

const router = Router();

router.get('/:email', adminMiddleware, employeeController.show);
router.post('/', employeeController.store);
router.put('/:email', adminMiddleware, employeeController.update);
router.delete('/:email', adminMiddleware, employeeController.destroy);

export default router;
