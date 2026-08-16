import { Router } from 'express';
import { body } from 'express-validator';
import * as socialMediaPartnerController from '../controllers/social-media-partner.controller';
import { authenticate, authorize, validate } from '../middleware';

const router = Router();

// Public registration (no auth required, but userId can be passed if logged in)
router.post('/register', [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('dob').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').trim().notEmpty().withMessage('Gender is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('mobile').trim().matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit mobile number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('declaration').custom((value) => {
    if (value === true || value === 'true') return true;
    throw new Error('Declaration must be accepted');
  }),
], validate, socialMediaPartnerController.register);

// User routes - no auth required for Firebase users
router.get('/user/:userId', socialMediaPartnerController.getRegistrationByUserId);
router.get('/:id/history', socialMediaPartnerController.getRegistrationStatusHistory);
router.get('/:id/download', socialMediaPartnerController.exportPDFById); // Public download for users

// Admin routes - require authentication and admin role
router.get('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), socialMediaPartnerController.getAllRegistrations);
router.get('/export/excel', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), socialMediaPartnerController.exportExcel);
router.get('/export/pdf', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), socialMediaPartnerController.exportPDF);
router.get('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), socialMediaPartnerController.getRegistrationById);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), socialMediaPartnerController.updateRegistration);
router.put('/:id/status', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), socialMediaPartnerController.updateStatus);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), socialMediaPartnerController.deleteRegistration);

export default router;
