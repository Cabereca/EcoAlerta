import { Router } from 'express';
import { occurrenceController } from '../controllers/occurrenceController';
import uploadsConfig from '../config/multerConfig';
import multer from 'multer';
import { userMiddleware } from '../middlewares/authUserMiddleware';
import { adminMiddleware } from '../middlewares/authAdminMiddleware';
import { validateOccurrenceMiddleware } from '../middlewares/validateOccurrenceMiddleware';

const routes = Router();

const upload = multer(uploadsConfig);

routes.get('/all', adminMiddleware, occurrenceController.index);
routes.get('/', userMiddleware, occurrenceController.show);
routes.post('/',
  userMiddleware,
  upload.array('images'),
  validateOccurrenceMiddleware,
  occurrenceController.store
);
routes.put('/:id', userMiddleware, occurrenceController.update);
routes.patch(
  '/:id/:status',
  adminMiddleware,
  occurrenceController.updateStatus
);
routes.delete('/:id', userMiddleware, occurrenceController.destroy);

export default routes;
