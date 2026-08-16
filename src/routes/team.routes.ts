import { Router } from 'express';

const router = Router();

// Simple teams endpoint returning sample data
router.get('/', (req, res) => {
  res.json({
    teams: [
      {
        id: '1',
        name: 'Garvi Gujarat',
        logoUrl: 'assets/teams/garvi_gujarat.png',
        abbreviation: 'GG',
        color: '#FF6B35'
      },
      {
        id: '2',
        name: 'Mumbai Strikers',
        logoUrl: 'assets/teams/mumbai_strikers.jpeg',
        abbreviation: 'MS',
        color: '#1E3A8A'
      }
    ]
  });
});

export default router;
  body('seasonId').notEmpty().withMessage('Season ID is required'),
  body('logoUrl').trim().notEmpty().withMessage('Logo URL is required'),
], validate, teamController.createTeamWithLogoUrl);

router.get('/', teamController.getTeams);

router.get('/:id', teamController.getTeamById);

router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), [
  body('name').optional().trim().notEmpty(),
  body('shortName').optional().trim().notEmpty(),
], validate, teamController.updateTeam);

router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), teamController.deleteTeam);

router.get('/:id/stats', teamController.getTeamStats);

export default router;
