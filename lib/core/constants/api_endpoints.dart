class ApiEndpoints {
  // Auth
  static const String login = '/api/auth/login';
  static const String register = '/api/auth/register';
  static const String logout = '/api/auth/logout';
  static const String refreshToken = '/api/auth/refresh';
  static const String forgotPassword = '/api/auth/forgot-password';
  static const String resetPassword = '/api/auth/reset-password';
  static const String verifyOtp = '/api/auth/verify-otp';

  // User
  static const String userProfile = '/api/user/profile';
  static const String updateProfile = '/api/user/update';
  static const String changePassword = '/api/user/change-password';
  static const String favoriteTeam = '/api/user/favorite-team';
  static const String favoritePlayer = '/api/user/favorite-player';
  
  // Matches
  static const String matches = '/api/matches';
  static const String liveMatches = '/api/matches/live';
  static const String upcomingMatches = '/api/matches/upcoming';
  static const String completedMatches = '/api/matches/completed';
  static const String matchDetails = '/api/matches';
  static const String matchScorecard = '/api/matches/scorecard';
  static const String matchStatistics = '/api/matches/statistics';
  static const String matchCommentary = '/api/matches/commentary';
  static const String matchLineup = '/api/matches/lineup';
  
  // Teams
  static const String teams = '/api/teams';
  static const String teamDetails = '/api/teams';
  static const String teamPlayers = '/api/teams/players';
  static const String teamMatches = '/api/teams/matches';

  // Players
  static const String players = '/api/players';
  static const String playerDetails = '/api/players';
  static const String playerStats = '/api/players/stats';

  // Tournament
  static const String tournament = '/api/tournament';
  static const String pointsTable = '/api/tournament/points-table';
  static const String tournamentStats = '/api/tournament/stats';

  // OTT
  static const String videos = '/api/videos';
  static const String videoDetails = '/api/videos';
  static const String liveStream = '/api/ott/live';
  static const String categories = '/api/ott/categories';
  static const String continueWatching = '/api/ott/continue-watching';
  static const String watchHistory = '/api/ott/history';

  // News
  static const String news = '/api/news';
  static const String newsDetails = '/api/news';
  static const String newsCategories = '/api/news/categories';

  // Gallery
  static const String gallery = '/api/gallery';
  static const String galleryAlbums = '/api/gallery/albums';
  static const String galleryImages = '/api/gallery/images';

  // Stories
  static const String stories = '/api/stories';

  // Notifications
  static const String notifications = '/api/notifications';
  static const String markRead = '/api/notifications/mark-read';
  static const String notificationSettings = '/api/notifications/settings';

  // Search
  static const String search = '/api/search';

  // Feedback
  static const String feedback = '/api/feedback';

  // Sponsors
  static const String sponsors = '/api/sponsors';
  
  // Admin
  static const String adminDashboard = '/admin/dashboard';
  static const String adminUsers = '/admin/users';
  static const String adminMatches = '/admin/matches';
  static const String adminTeams = '/admin/teams';
  static const String adminPlayers = '/admin/players';
  static const String adminVideos = '/admin/videos';
  static const String adminNews = '/admin/news';
  static const String adminGallery = '/admin/gallery';
  static const String adminStories = '/admin/stories';
  static const String adminNotifications = '/admin/notifications';
  static const String adminSettings = '/admin/settings';
}
