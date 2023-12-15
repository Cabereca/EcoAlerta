import { Router } from 'express';
import { occurrenceController } from '../controllers/occurrenceController';
import uploadsConfig from '../config/multerConfig';
import multer from 'multer';

const routes = Router();

const upload = multer(uploadsConfig);

routes.get('/', occurrenceController.index);
routes.post('/', upload.array('images'), occurrenceController.store);
routes.put('/:id', occurrenceController.update);
routes.delete('/:id', occurrenceController.destroy);

export default routes;
