import { Router } from 'express';
import { body } from 'express-validator';
import * as videoCategoryController from '../controllers/video-category.controller';
import { validate } from '../middleware';

const router = Router();

// Public GET endpoints
router.get('/', videoCategoryController.getVideoCategories);
router.get('/:id', videoCategoryController.getVideoCategoryById);

// POST - Create category
router.post('/', videoCategoryController.createVideoCategory);

// PUT - Update category
router.put('/:id', videoCategoryController.updateVideoCategory);

// PATCH - Partial update
router.patch('/:id', videoCategoryController.updateVideoCategory);

// DELETE - Delete category
router.delete('/:id', videoCategoryController.deleteVideoCategory);

export default router;
