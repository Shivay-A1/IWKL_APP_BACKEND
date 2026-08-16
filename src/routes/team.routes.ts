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
