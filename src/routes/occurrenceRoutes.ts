import { Router } from 'express';
import { occurrenceController } from '../controllers/occurrenceController';
import uploadsConfig from '../config/multerConfig';
import multer from 'multer';
import { authMiddleware } from '../middlewares/authMiddleware';

const routes = Router();

const upload = multer(uploadsConfig);

routes.get('/', authMiddleware, occurrenceController.index);
routes.post(
  '/',
  authMiddleware,
  upload.array('images'),
  occurrenceController.store
);
routes.put('/:id', authMiddleware, occurrenceController.update);
routes.patch('/:id', authMiddleware, occurrenceController.updateStatus);
routes.delete('/:id', authMiddleware, occurrenceController.destroy);

export default routes;
