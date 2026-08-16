import { Router } from 'express';
import { body } from 'express-validator';
import * as leadershipController from '../controllers/leadership.controller';
import { authenticate, validate } from '../middleware';

const router = Router();

router.get('/', leadershipController.getAllLeadership);
router.get('/:id', leadershipController.getLeadershipById);

router.post('/', authenticate, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('photo').trim().notEmpty().withMessage('Photo is required'),
], validate, leadershipController.createLeadership);

router.put('/:id', authenticate, [
  body('name').optional().trim().notEmpty(),
  body('designation').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('photo').optional().trim().notEmpty(),
], validate, leadershipController.updateLeadership);

router.delete('/:id', authenticate, leadershipController.deleteLeadership);

export default router;
