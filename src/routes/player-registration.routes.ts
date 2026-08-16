import { Router } from 'express';
import { body } from 'express-validator';
import * as playerRegistrationController from '../controllers/player-registration.controller';
import { authenticate, authorize, validate, upload } from '../middleware';

const router = Router();

// File upload proxy route - uploads files to Firebase Storage via backend (no auth required for registration)
router.post('/upload-file', upload.single('file'), playerRegistrationController.uploadFile);

// Public registration (no auth required, but userId can be passed if logged in)
router.post('/register', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'aadhaar', maxCount: 1 },
  { name: 'ageProof', maxCount: 1 },
  { name: 'sportsCertificate', maxCount: 1 },
  { name: 'medicalCertificate', maxCount: 1 },
  { name: 'stateAssociationCertificate', maxCount: 1 },
  { name: 'additionalCertificate', maxCount: 1 },
  { name: 'videoHighlights', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
]), (req, res, next) => {
  console.log('=== REGISTRATION REQUEST BODY ===');
  console.log('Body keys:', Object.keys(req.body));
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  console.log('===============================');
  next();
}, [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('fatherName').trim().notEmpty().withMessage('Father name is required'),
  body('motherName').trim().notEmpty().withMessage('Mother name is required'),
  body('dob').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').trim().notEmpty().withMessage('Gender is required'),
  body('aadhaar').trim().matches(/^\d{12}$/).withMessage('Valid 12-digit Aadhaar number is required'),
  body('mobile').trim().matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit mobile number is required'),
  body('whatsapp').trim().matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit WhatsApp number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pinCode').trim().matches(/^\d{6}$/).withMessage('Valid 6-digit PIN code is required'),
  body('playingPosition').trim().notEmpty().withMessage('Playing position is required'),
  body('strongHand').trim().notEmpty().withMessage('Strong hand is required'),
  body('strongLeg').trim().notEmpty().withMessage('Strong leg is required'),
  body('emergencyName').trim().notEmpty().withMessage('Emergency contact name is required'),
  body('emergencyRelation').trim().notEmpty().withMessage('Emergency contact relation is required'),
  body('emergencyMobile').trim().matches(/^[6-9]\d{9}$/).withMessage('Valid emergency mobile number is required'),
], validate, playerRegistrationController.register);

// Admin routes - require authentication and admin role
router.get('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), playerRegistrationController.getAllRegistrations);
router.get('/user/:userId', authenticate, playerRegistrationController.getRegistrationByUserId);
router.get('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), playerRegistrationController.getRegistrationById);
router.get('/:id/history', authenticate, playerRegistrationController.getRegistrationStatusHistory);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), playerRegistrationController.updateRegistration);
router.put('/:id/status', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), playerRegistrationController.updateStatus);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), playerRegistrationController.deleteRegistration);
router.get('/export/excel', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), playerRegistrationController.exportExcel);
router.get('/export/pdf', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), playerRegistrationController.exportPDF);

export default router;
