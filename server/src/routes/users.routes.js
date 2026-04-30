import { Router } from 'express';
import { listUsers, updateUser, deactivateUser } from '../controllers/users.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validateBody } from '../middleware/validateBody.js';
import { z } from 'zod';

const router = Router();

router.get('/', authenticate, authorize('admin'), listUsers);
router.put('/:userId', authenticate, authorize('admin'), validateBody(z.object({
  role: z.enum(['admin', 'editor', 'viewer']).optional(),
  name: z.string().min(1).max(100).optional(),
  is_active: z.boolean().optional(),
})), updateUser);
router.delete('/:userId', authenticate, authorize('admin'), deactivateUser);

export default router;
