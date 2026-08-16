import { Router } from 'express';
import authRoutes from './auth.routes';
import seasonRoutes from './season.routes';
import teamRoutes from './team.routes';
import stadiumRoutes from './stadium.routes';
import playerRoutes from './player.routes';
import matchRoutes from './match.routes';
import pointsRoutes from './points.routes';
import pointsTableRoutes from './pointsTable.routes';
import videoRoutes from './video.routes';
import newsRoutes from './news.routes';
import galleryRoutes from './gallery.routes';
import sponsorRoutes from './sponsor.routes';
import bannerRoutes from './banner.routes';
import homepageBannerRoutes from './homepage-banner.routes';
import notificationRoutes from './notification.routes';
import userRoutes from './user.routes';
import championRoutes from './champion.routes';
import leadershipRoutes from './leadership.routes';
import fanClubRoutes from './fan-club.routes';
import footerRoutes from './footer.routes';
import siteSettingsRoutes from './site-settings.routes';
import unpluggedRoutes from './unplugged.routes';
import homepageRoutes from './homepage.routes';
import seedRoutes from './seed.routes';
import playerRegistrationRoutes from './player-registration.routes';
import fileUploadRoutes from './file-upload.routes';
import ottRoutes from './ott.routes';
import appStoriesRoutes from './app-stories.routes';
import pushNotificationRoutes from './push-notification.routes';
import appSettingsRoutes from './app-settings.routes';
import mobileBannerRoutes from './mobile-banner.routes';
import storyRoutes from './story.routes';
import appManagementRoutes from './app-management.routes';

const router = Router();

// Root route
router.get('/', (req, res) => {
  res.json({
    message: 'IWKL API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      seasons: '/api/seasons',
      teams: '/api/teams',
      stadiums: '/api/stadiums',
      players: '/api/players',
      matches: '/api/matches',
      points: '/api/points',
      pointsTable: '/api/points-table',
      videos: '/api/videos',
      news: '/api/news',
      gallery: '/api/gallery',
      sponsors: '/api/sponsors',
      banners: '/api/banners',
      homepageBanners: '/api/homepage-banners',
      notifications: '/api/notifications',
      users: '/api/users',
      champions: '/api/champions',
      leadership: '/api/leadership',
      fanClub: '/api/fan-club',
      footer: '/api/footer',
      siteSettings: '/api/site-settings',
      unplugged: '/api/unplugged',
      homepage: '/api/homepage',
      seed: '/api/seed',
      playerRegistration: '/api/player-registration',
      files: '/api/files',
      ott: '/api/ott',
      appStories: '/api/stories',
      pushNotifications: '/api/push-notifications',
      appSettings: '/api/app-settings',
      mobileBanners: '/api/mobile-banners',
      stories: '/api/stories',
      appManagement: '/api/app-management',
    },
  });
});

router.use('/auth', authRoutes);
router.use('/seasons', seasonRoutes);
router.use('/teams', teamRoutes);
router.use('/stadiums', stadiumRoutes);
router.use('/players', playerRoutes);
router.use('/matches', matchRoutes);
router.use('/points', pointsRoutes);
router.use('/points-table', pointsTableRoutes);
router.use('/videos', videoRoutes);
router.use('/news', newsRoutes);
router.use('/gallery', galleryRoutes);
router.use('/sponsors', sponsorRoutes);
router.use('/banners', bannerRoutes);
router.use('/homepage-banners', homepageBannerRoutes);
router.use('/notifications', notificationRoutes);
router.use('/users', userRoutes);
router.use('/champions', championRoutes);
router.use('/leadership', leadershipRoutes);
router.use('/fan-club', fanClubRoutes);
router.use('/footer', footerRoutes);
router.use('/site-settings', siteSettingsRoutes);
router.use('/unplugged', unpluggedRoutes);
router.use('/homepage', homepageRoutes);
router.use('/seed', seedRoutes);
router.use('/player-registration', playerRegistrationRoutes);
router.use('/files', fileUploadRoutes);
router.use('/ott', ottRoutes);
router.use('/stories', appStoriesRoutes);
router.use('/push-notifications', pushNotificationRoutes);
router.use('/app-settings', appSettingsRoutes);
router.use('/mobile-banners', mobileBannerRoutes);
router.use('/stories', storyRoutes);
router.use('/app-management', appManagementRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
