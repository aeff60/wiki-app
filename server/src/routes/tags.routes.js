import { Router } from 'express';
import { listTags, createTag } from '../controllers/tags.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validateBody } from '../middleware/validateBody.js';
import { z } from 'zod';

const router = Router();

router.get('/', authenticate, listTags);
router.post('/', authenticate, authorize('editor'), validateBody(z.object({ name: z.string().min(1).max(50) })), createTag);

export default router;
