import { Router } from 'express';
import teamRoutes from './team.routes';
import videoRoutes from './video.routes';

const router = Router();

// Root route
router.get('/', (req, res) => {
  res.json({
    message: 'IWKL API',
    version: '1.0.0',
    endpoints: {
      teams: '/api/teams',
      videos: '/api/videos',
      health: '/api/health',
    },
  });
});

// Essential routes only
router.use('/teams', teamRoutes);
router.use('/videos', videoRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
