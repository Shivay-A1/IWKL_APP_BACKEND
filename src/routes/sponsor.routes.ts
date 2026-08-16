import { Router } from 'express';
import { body } from 'express-validator';
import * as sponsorController from '../controllers/sponsor.controller';
import { authenticate, authorize, validate, uploadSingle, apiLimiter } from '../middleware';

const router = Router();

router.use(authenticate);

router.post('/', authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, uploadSingle('logo'), [
  body('name').trim().notEmpty().withMessage('Sponsor name is required'),
  body('category').notEmpty().withMessage('Category is required'),
], validate, sponsorController.createSponsor);

router.get('/', sponsorController.getSponsors);

router.get('/active', sponsorController.getActiveSponsors);

router.get('/category/:category', sponsorController.getSponsorsByCategory);

router.get('/:id', sponsorController.getSponsorById);

router.put('/:id', authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), uploadSingle('logo'), [
  body('name').optional().trim().notEmpty(),
], validate, sponsorController.updateSponsor);

router.delete('/:id', authorize('SUPER_ADMIN'), sponsorController.deleteSponsor);

export default router;
