import { Router } from 'express';
import { uploadFile } from '../controllers/uploads.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { upload } from '../config/multer.js';

const router = Router();

router.post('/', authenticate, authorize('editor'), upload.single('file'), uploadFile);

export default router;
