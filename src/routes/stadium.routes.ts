import { Router } from 'express';
import { body } from 'express-validator';
import * as stadiumController from '../controllers/stadium.controller';
import { authenticate, authorize, validate, uploadSingle, apiLimiter } from '../middleware';

const router = Router();

router.post('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, uploadSingle('image'), [
  body('name').trim().notEmpty().withMessage('Stadium name is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
], validate, stadiumController.createStadium);

router.get('/', stadiumController.getStadiums);

router.get('/:id', stadiumController.getStadiumById);

router.put('/:id', authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), uploadSingle('image'), [
  body('name').optional().trim().notEmpty(),
  body('city').optional().trim().notEmpty(),
], validate, stadiumController.updateStadium);

router.delete('/:id', authorize('SUPER_ADMIN'), stadiumController.deleteStadium);

export default router;
