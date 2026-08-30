import { Router } from 'express';
import { body } from 'express-validator';
import * as galleryController from '../controllers/gallery.controller';
import { validate, uploadMultiple, apiLimiter } from '../middleware';

const router = Router();

router.get('/', galleryController.getGalleryItems);

router.post('/', apiLimiter, uploadMultiple('files', 2), [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty if provided'),
], validate, galleryController.createGalleryItem);

router.get('/category/:category', galleryController.getGalleryByCategory);

router.get('/album/:album', galleryController.getGalleryByAlbum);

router.get('/:id', galleryController.getGalleryItemById);

router.put('/:id', uploadMultiple('files', 2), [
  body('title').optional().trim().notEmpty(),
], validate, galleryController.updateGalleryItem);

router.delete('/:id', galleryController.deleteGalleryItem);

export default router;
