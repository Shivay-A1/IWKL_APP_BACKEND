class ApiEndpoints {
  // Auth
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String logout = '/auth/logout';
  static const String refreshToken = '/auth/refresh';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';
  static const String verifyOtp = '/auth/verify-otp';
  
  // User
  static const String userProfile = '/user/profile';
  static const String updateProfile = '/user/update';
  static const String changePassword = '/user/change-password';
  static const String favoriteTeam = '/user/favorite-team';
  static const String favoritePlayer = '/user/favorite-player';
  
  // Matches
  static const String liveMatches = '/matches/live';
  static const String upcomingMatches = '/matches/upcoming';
  static const String completedMatches = '/matches/completed';
  static const String matchDetails = '/matches';
  static const String matchScorecard = '/matches/scorecard';
  static const String matchStatistics = '/matches/statistics';
  static const String matchCommentary = '/matches/commentary';
  static const String matchLineup = '/matches/lineup';
  
  // Teams
  static const String teams = '/teams';
  static const String teamDetails = '/teams';
  static const String teamPlayers = '/teams/players';
  static const String teamMatches = '/teams/matches';
  
  // Players
  static const String players = '/players';
  static const String playerDetails = '/players';
  static const String playerStats = '/players/stats';
  
  // Tournament
  static const String tournament = '/tournament';
  static const String pointsTable = '/tournament/points-table';
  static const String tournamentStats = '/tournament/stats';
  
  // OTT
  static const String videos = '/ott/videos';
  static const String videoDetails = '/ott/videos';
  static const String liveStream = '/ott/live';
  static const String categories = '/ott/categories';
  static const String continueWatching = '/ott/continue-watching';
  static const String watchHistory = '/ott/history';
  
  // News
  static const String news = '/news';
  static const String newsDetails = '/news';
  static const String newsCategories = '/news/categories';
  
  // Gallery
  static const String gallery = '/gallery';
  static const String galleryAlbums = '/gallery/albums';
  static const String galleryImages = '/gallery/images';
  
  // Stories
  static const String stories = '/stories';
  
  // Notifications
  static const String notifications = '/notifications';
  static const String markRead = '/notifications/mark-read';
  static const String notificationSettings = '/notifications/settings';
  
  // Search
  static const String search = '/search';
  
  // Feedback
  static const String feedback = '/feedback';
  
  // Sponsors
  static const String sponsors = '/sponsors';
  
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
