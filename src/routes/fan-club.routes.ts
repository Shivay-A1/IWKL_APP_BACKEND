import { Router } from 'express';
import { body } from 'express-validator';
import * as fanClubController from '../controllers/fan-club.controller';
import { authenticate, validate, upload } from '../middleware';

const router = Router();

router.post('/register', upload.single('documentSignature'), [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('mobileNumber').trim().notEmpty().withMessage('Mobile number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('gender').trim().notEmpty().withMessage('Gender is required'),
  body('age').isInt({ min: 1 }).withMessage('Valid age is required'),
  body('favoriteTeamId').trim().notEmpty().withMessage('Favorite team is required'),
], validate, fanClubController.registerFanClub);

router.get('/', fanClubController.getAllRegistrations);
router.get('/export/csv', fanClubController.exportRegistrations);

export default router;
