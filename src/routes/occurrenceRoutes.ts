import { Router } from 'express';
import multer from 'multer';
import uploadsConfig from '../config/multerConfig';
import { occurrenceController } from '../controllers/occurrenceController';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { userMiddleware } from '../middlewares/userMiddleware';

const routes = Router();

const upload = multer(uploadsConfig);

routes.get('/all', occurrenceController.index);
routes.get('/byUser/:userId', userMiddleware, occurrenceController.show);
routes.get('/:id', userMiddleware, occurrenceController.showOne);
routes.post(
  '/',
  userMiddleware,
  upload.array('images'),
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
