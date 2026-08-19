class AppConstants {
  // API Configuration
  static const String baseUrl = 'http://localhost:5000/api';
  static const String socketUrl = 'http://localhost:5000';
  
  // App Info
  static const String appName = 'IWKL OFFICIAL APP';
  static const String appVersion = '1.0.0';
  
  // Colors
  static const int primaryColorValue = 0xFF8B2EFF;
  static const int secondaryColorValue = 0xFFA43EFF;
  static const int accentColorValue = 0xFFF8C23D;
  static const int backgroundColorValue = 0xFF14031E;
  static const int cardColorValue = 0xFF240833;
  static const int secondaryCardColorValue = 0xFF321048;
  static const int darkPurpleValue = 0xFF5E149B;
  static const int softGoldValue = 0xFFD4A33C;
  static const int whiteValue = 0xFFFFFFFF;
  static const int secondaryTextValue = 0xFFC9C9C9;
  static const int mutedTextValue = 0xFF8F8F8F;
  
  // Season
  static const String seasonName = 'IWKL Season 2026';
  
  // Team Colors
  static const Map<String, int> teamColors = {
    'Ayodhya Shakti': 0xFFDC2626,
    'Delhi Warriors': 0xFF1D4ED8,
    'Garvi Gujarat': 0xFFD97706,
    'Punjab Wings': 0xFF6D28D9,
    'Mumbai Strikers': 0xFF06B6D4,
    'Kashmiri Queens': 0xFF7C3AED,
    'Namma Bengaluru': 0xFF84CC16,
    'Haryanvi Fighters': 0xFF0F766E,
    'Kolkata Rangers': 0xFF1E3A8A,
    'Odisha Kalingas': 0xFFE11D48,
  };

  // Team Secondary Colors
  static const Map<String, int> teamSecondaryColors = {
    'Ayodhya Shakti': 0xFFF59E0B,
    'Delhi Warriors': 0xFF3B82F6,
    'Garvi Gujarat': 0xFFB45309,
    'Punjab Wings': 0xFFA855F7,
    'Mumbai Strikers': 0xFF38BDF8,
    'Kashmiri Queens': 0xFFC084FC,
    'Namma Bengaluru': 0xFF22C55E,
    'Haryanvi Fighters': 0xFF14B8A6,
    'Kolkata Rangers': 0xFF2563EB,
    'Odisha Kalingas': 0xFFBE123C,
  };

  // Team Gradient Colors (Start, End)
  static const Map<String, List<int>> teamGradients = {
    'Ayodhya Shakti': [0xFFDC2626, 0xFFF59E0B],
    'Delhi Warriors': [0xFF1D4ED8, 0xFF3B82F6],
    'Garvi Gujarat': [0xFFF59E0B, 0xFFB45309],
    'Punjab Wings': [0xFF7C3AED, 0xFFA855F7],
    'Mumbai Strikers': [0xFF0891B2, 0xFF38BDF8],
    'Kashmiri Queens': [0xFF6D28D9, 0xFFC084FC],
    'Namma Bengaluru': [0xFFA3E635, 0xFF22C55E],
    'Haryanvi Fighters': [0xFF115E59, 0xFF2DD4BF],
    'Kolkata Rangers': [0xFF1E40AF, 0xFF3B82F6],
    'Odisha Kalingas': [0xFFE11D48, 0xFFBE123C],
  };

  // Team Glow Colors
  static const Map<String, int> teamGlowColors = {
    'Ayodhya Shakti': 0xFFDC2626,
    'Delhi Warriors': 0xFF1D4ED8,
    'Garvi Gujarat': 0xFFD97706,
    'Punjab Wings': 0xFF6D28D9,
    'Mumbai Strikers': 0xFF06B6D4,
    'Kashmiri Queens': 0xFF7C3AED,
    'Namma Bengaluru': 0xFF84CC16,
    'Haryanvi Fighters': 0xFF0F766E,
    'Kolkata Rangers': 0xFF1E3A8A,
    'Odisha Kalingas': 0xFFE11D48,
  };

  // Team Logo Paths
  static const Map<String, String> teamLogos = {
    'Ayodhya Shakti': 'assets/teams/ayodhya_shakti.jpeg',
    'Delhi Warriors': 'assets/teams/delhi_warriors.jpeg',
    'Garvi Gujarat': 'assets/teams/garvi_gujarat.png',
    'Punjab Wings': 'assets/teams/punjab_wings.jpeg',
    'Mumbai Strikers': 'assets/teams/mumbai_strikers.jpeg',
    'Kashmiri Queens': 'assets/teams/kashmiri_queens.jpeg',
    'Namma Bengaluru': 'assets/teams/namma_bengaluru.jpeg',
    'Haryanvi Fighters': 'assets/teams/haryanvi_fighters.jpeg',
    'Kolkata Rangers': 'assets/teams/kolkata_rangers.jpeg',
    'Odisha Kalingas': 'assets/teams/odisha_kalingas.jpeg',
  };

  // All Team Names
  static const List<String> allTeams = [
    'Ayodhya Shakti',
    'Delhi Warriors',
    'Garvi Gujarat',
    'Punjab Wings',
    'Mumbai Strikers',
    'Kashmiri Queens',
    'Namma Bengaluru',
    'Haryanvi Fighters',
    'Kolkata Rangers',
    'Odisha Kalingas',
  ];

  // Hero Banner Path
  static const String heroBannerPath = 'assets/banners/hero_banner.png';
  
  // Storage Keys
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userDataKey = 'user_data';
  static const String themeKey = 'theme_mode';
  
  // Pagination
  static const int defaultPageSize = 20;
  
  // Timeout
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  
  // Image Quality
  static const int imageQuality = 85;
  
  // Video Settings
  static const Duration videoCacheDuration = Duration(days: 7);
  
  // Story Duration
  static const Duration storyDuration = Duration(seconds: 5);
  
  // Notification Channels
  static const String notificationChannelId = 'iwkl_official_notifications';
  static const String notificationChannelName = 'IWKL OFFICIAL APP Notifications';
  static const String notificationChannelDescription = 'Notifications for IWKL OFFICIAL APP';
}
