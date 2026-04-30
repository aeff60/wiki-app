import { Router } from 'express';
import { listComments, createComment, updateComment, deleteComment } from '../controllers/comments.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateBody } from '../middleware/validateBody.js';
import { z } from 'zod';

const router = Router({ mergeParams: true });

const commentSchema = z.object({
  content: z.string().min(1).max(5000),
  parent_id: z.string().uuid().optional().nullable(),
});

router.get('/:pageId/comments', authenticate, listComments);
router.post('/:pageId/comments', authenticate, validateBody(commentSchema), createComment);
router.put('/:pageId/comments/:commentId', authenticate, validateBody(z.object({ content: z.string().min(1).max(5000) })), updateComment);
router.delete('/:pageId/comments/:commentId', authenticate, deleteComment);

export default router;
