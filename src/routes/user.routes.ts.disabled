import { Router } from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/user.controller';
import { authenticate, authorize, validate, apiLimiter } from '../middleware';

const router = Router();

router.get('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), userController.getUsers);

router.get('/dashboard/stats', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), userController.getDashboardStats);

router.get('/:id', userController.getUserById);

router.put('/:id', authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail(),
], validate, userController.updateUser);

router.delete('/:id', authorize('SUPER_ADMIN'), userController.deleteUser);

router.patch('/:id/role', authorize('SUPER_ADMIN'), [
  body('role').notEmpty().withMessage('Role is required'),
], validate, userController.updateUserRole);

router.post('/favorites', authenticate, apiLimiter, [
  body('teamId').notEmpty().withMessage('Team ID is required'),
], validate, userController.addFavoriteTeam);

router.delete('/favorites/:teamId', authenticate, userController.removeFavoriteTeam);

router.get('/favorites/list', authenticate, userController.getFavoriteTeams);

export default router;
