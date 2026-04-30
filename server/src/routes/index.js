import { Router } from 'express';
import authRoutes from './auth.routes.js';
import spacesRoutes from './spaces.routes.js';
import pagesRoutes from './pages.routes.js';
import tagsRoutes from './tags.routes.js';
import commentsRoutes from './comments.routes.js';
import searchRoutes from './search.routes.js';
import usersRoutes from './users.routes.js';
import uploadsRoutes from './uploads.routes.js';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/spaces', spacesRoutes);
router.use('/spaces', pagesRoutes);
router.use('/pages', commentsRoutes);
router.use('/tags', tagsRoutes);
router.use('/search', searchRoutes);
router.use('/users', usersRoutes);
router.use('/uploads', uploadsRoutes);
