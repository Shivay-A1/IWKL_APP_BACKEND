import { Router } from 'express';
// Temporarily disable complex routes for deployment
// import authRoutes from './auth.routes';
// import seasonRoutes from './season.routes';
import teamRoutes from './team.routes';
// import stadiumRoutes from './stadium.routes';
// import playerRoutes from './player.routes';
// import matchRoutes from './match.routes';
// import pointsRoutes from './points.routes';
// import pointsTableRoutes from './pointsTable.routes';
import videoRoutes from './video.routes';
// import newsRoutes from './news.routes';
// import galleryRoutes from './gallery.routes';
// import sponsorRoutes from './sponsor.routes';
// import bannerRoutes from './banner.routes';
// import homepageBannerRoutes from './homepage-banner.routes';
// import notificationRoutes from './notification.routes';
// import userRoutes from './user.routes';
// import championRoutes from './champion.routes';
// import leadershipRoutes from './leadership.routes';
// import fanClubRoutes from './fan-club.routes';
// import footerRoutes from './footer.routes';
// import siteSettingsRoutes from './site-settings.routes';
// import unpluggedRoutes from './unplugged.routes';
// import homepageRoutes from './homepage.routes';
// import seedRoutes from './seed.routes';
// import playerRegistrationRoutes from './player-registration.routes';
// import fileUploadRoutes from './file-upload.routes';
// import ottRoutes from './ott.routes';
// import appStoriesRoutes from './app-stories.routes';
// import pushNotificationRoutes from './push-notification.routes';
// import appSettingsRoutes from './app-settings.routes';
// import mobileBannerRoutes from './mobile-banner.routes';
// import storyRoutes from './story.routes';
// import appManagementRoutes from './app-management.routes';

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
