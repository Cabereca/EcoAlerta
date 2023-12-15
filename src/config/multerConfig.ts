import { Options } from 'multer';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const multerConfig: Options = {
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename(req, file, callback) {
      callback(
        null,
        `${crypto.randomBytes(6).toString('hex')}-${file.originalname}`
      );
    }
  }),
  limits: {
    fileSize: 8 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    const mimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'video/mp4',
      'video/mov',
      'video/avi',
      'video/mkv',
      'video/flv',
      'video/wmv',
      'video/3gp',
      'video/mpeg',
      'video/webm'
    ];

    if (!mimeTypes.includes(file.mimetype)) {
      return cb(null, false);
    }
    cb(null, true);
  }
};

export default multerConfig;
