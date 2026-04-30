import { Router } from 'express';
import {
  getPageTree,
  createPage,
  getPage,
  updatePage,
  deletePage,
  listRevisions,
  getRevision,
  restoreRevision,
} from '../controllers/pages.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validateBody } from '../middleware/validateBody.js';
import { z } from 'zod';

const router = Router({ mergeParams: true });

const pageSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().optional().default(''),
  parent_id: z.string().uuid().optional().nullable(),
  is_published: z.boolean().optional().default(false),
  tags: z.array(z.string().min(1).max(50)).optional().default([]),
  change_summary: z.string().optional(),
});

router.get('/:spaceId/pages', authenticate, getPageTree);
router.post('/:spaceId/pages', authenticate, authorize('editor'), validateBody(pageSchema), createPage);
router.get('/:spaceId/pages/:pageId', authenticate, getPage);
router.put('/:spaceId/pages/:pageId', authenticate, authorize('editor'), validateBody(pageSchema.partial()), updatePage);
router.delete('/:spaceId/pages/:pageId', authenticate, authorize('editor'), deletePage);

router.get('/:spaceId/pages/:pageId/revisions', authenticate, listRevisions);
router.get('/:spaceId/pages/:pageId/revisions/:revisionId', authenticate, getRevision);
router.post('/:spaceId/pages/:pageId/revisions/:revisionId/restore', authenticate, authorize('editor'), restoreRevision);

export default router;
