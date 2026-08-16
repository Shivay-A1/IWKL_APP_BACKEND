import { Router } from 'express';
import { body } from 'express-validator';
import * as galleryController from '../controllers/gallery.controller';
import { authenticate, authorize, validate, uploadMultiple, apiLimiter } from '../middleware';

const router = Router();

router.get('/', galleryController.getGalleryItems);

router.post('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, uploadMultiple('files', 2), [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty if provided'),
], validate, galleryController.createGalleryItem);

router.get('/category/:category', galleryController.getGalleryByCategory);

router.get('/album/:album', galleryController.getGalleryByAlbum);

router.get('/:id', galleryController.getGalleryItemById);

router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), uploadMultiple('files', 2), [
  body('title').optional().trim().notEmpty(),
], validate, galleryController.updateGalleryItem);

router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), galleryController.deleteGalleryItem);

export default router;
