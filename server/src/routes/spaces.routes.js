import { Router } from 'express';
import { listSpaces, createSpace, getSpace, updateSpace, deleteSpace } from '../controllers/spaces.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validateBody } from '../middleware/validateBody.js';
import { z } from 'zod';

const router = Router();

const spaceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  is_public: z.boolean().optional().default(false),
});

router.get('/', authenticate, listSpaces);
router.post('/', authenticate, authorize('editor'), validateBody(spaceSchema), createSpace);
router.get('/:spaceId', authenticate, getSpace);
router.put('/:spaceId', authenticate, authorize('editor'), validateBody(spaceSchema.partial()), updateSpace);
router.delete('/:spaceId', authenticate, authorize('admin'), deleteSpace);

export default router;
