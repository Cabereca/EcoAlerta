/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import employeeController from '../controllers/employeeController';
import { adminMiddleware } from '../middlewares/authAdminMiddleware';
import { validateAdminMiddleware } from '../middlewares/validateAdminMiddleware';

const router = Router();

router.get('/', adminMiddleware, employeeController.show);
router.post('/', validateAdminMiddleware, employeeController.store);
router.put('/', adminMiddleware, employeeController.update);
router.delete('/', adminMiddleware, employeeController.destroy);

export default router;
