import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'core/theme/app_theme.dart';
import 'core/theme/theme_provider.dart';
import 'core/network/api_client.dart';
import 'core/network/socket_client.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/auth/presentation/bloc/auth_event.dart';
import 'features/auth/presentation/bloc/auth_state.dart';
import 'features/auth/presentation/screens/premium_login_screen.dart';
import 'features/auth/presentation/screens/premium_signup_screen.dart';
import 'features/auth/presentation/screens/premium_forgot_password_screen.dart';
import 'features/auth/data/repositories/auth_repository_impl.dart';
import 'features/auth/domain/usecases/login_usecase.dart';
import 'features/auth/domain/usecases/register_usecase.dart';
import 'features/auth/domain/usecases/logout_usecase.dart';
import 'features/auth/domain/usecases/get_current_user_usecase.dart';
import 'features/auth/domain/usecases/forgot_password_usecase.dart';
import 'features/auth/domain/usecases/reset_password_usecase.dart';
import 'features/auth/domain/usecases/verify_otp_usecase.dart';
import 'features/home/presentation/screens/premium_home_screen.dart';
import 'features/home/presentation/bloc/home_bloc.dart';
import 'features/home/presentation/bloc/home_event.dart';
import 'features/home/data/repositories/home_repository_impl.dart';
import 'features/home/domain/usecases/load_home_data_usecase.dart';
import 'features/search/presentation/screens/premium_search_screen.dart';
import 'features/notifications/presentation/screens/premium_notifications_screen.dart';
import 'features/admin/presentation/screens/premium_admin_dashboard_screen.dart';
import 'features/admin/presentation/screens/admin_login_screen.dart';
import 'features/team/presentation/screens/team_profile_screen.dart';
import 'features/profile/presentation/screens/premium_profile_screen.dart';
import 'features/points_table/presentation/screens/points_table_screen.dart';
import 'features/settings/presentation/screens/premium_settings_screen.dart';
import 'features/fan_club/presentation/screens/fan_club_screen.dart';
import 'features/fan_club/presentation/screens/fan_club_registration_screen.dart';
import 'features/support/presentation/screens/support_screen.dart';
import 'features/teams/presentation/screens/teams_screen.dart';
import 'features/gallery/presentation/screens/gallery_screen.dart';
import 'features/news/presentation/screens/news_screen.dart';
import 'features/players/presentation/screens/players_screen.dart';
import 'features/schedule/presentation/screens/premium_matches_screen.dart';
import 'features/ott/presentation/screens/premium_ott_screen.dart';
import 'features/live_match/presentation/screens/live_match_screen.dart';
import 'core/constants/app_constants.dart';
import 'core/network/api_client.dart';
import 'screens/premium_splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  runApp(IWKLApp(preferences: prefs));
}

class IWKLApp extends StatelessWidget {
  final SharedPreferences preferences;
  
  const IWKLApp({super.key, required this.preferences});

  @override
  Widget build(BuildContext context) {
    final apiClient = ApiClient(preferences);
    final socketClient = SocketClient();
    
    final authRepository = AuthRepositoryImpl(apiClient, preferences);
    
    final authBloc = AuthBloc(
      loginUseCase: LoginUseCase(authRepository),
      registerUseCase: RegisterUseCase(authRepository),
      logoutUseCase: LogoutUseCase(authRepository),
      getCurrentUserUseCase: GetCurrentUserUseCase(authRepository),
      forgotPasswordUseCase: ForgotPasswordUseCase(authRepository),
      resetPasswordUseCase: ResetPasswordUseCase(authRepository),
      verifyOtpUseCase: VerifyOtpUseCase(authRepository),
    );

    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        BlocProvider<AuthBloc>(
          create: (context) => authBloc..add(CheckAuthEvent()),
        ),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, child) {
          return MaterialApp(
            title: 'IWKL OFFICIAL APP',
            debugShowCheckedModeBanner: false,
            theme: themeProvider.isDarkMode ? AppTheme.darkTheme : AppTheme.lightTheme,
            initialRoute: '/',
            routes: {
              '/': (context) => const PremiumSplashScreen(),
              '/login': (context) => const PremiumLoginScreen(),
              '/register': (context) => const PremiumSignupScreen(),
              '/forgot-password': (context) => const PremiumForgotPasswordScreen(),
              '/home': (context) => BlocProvider(
                create: (context) => HomeBloc(
                  LoadHomeDataUseCase(HomeRepositoryImpl(ApiClient(preferences))),
                )..add(LoadHomeData()),
                child: const PremiumHomeScreen(),
              ),
              '/search': (context) => const PremiumSearchScreen(),
              '/notifications': (context) => const PremiumNotificationsScreen(),
              '/live-match': (context) => const LiveMatchScreen(),
              '/ott': (context) => const PremiumOTTScreen(),
              '/schedule': (context) => const PremiumMatchesScreen(),
              '/profile': (context) => const PremiumProfileScreen(),
              '/teams': (context) => const TeamsScreen(),
              '/players': (context) => const PlayersScreen(),
              '/points-table': (context) => const PointsTableScreen(),
              '/gallery': (context) => const GalleryScreen(),
              '/news': (context) => const NewsScreen(),
              '/fan-club': (context) => const FanClubScreen(),
              '/fan-club-registration': (context) => const FanClubRegistrationScreen(),
              '/membership': (context) => const PlaceholderScreen(title: 'Membership'),
              '/downloads': (context) => const PlaceholderScreen(title: 'Downloads'),
              '/settings': (context) => const PremiumSettingsScreen(),
              '/support': (context) => const SupportScreen(),
              '/about': (context) => const PlaceholderScreen(title: 'About'),
              '/forgot-password': (context) => const PlaceholderScreen(title: 'Forgot Password'),
              '/admin-login': (context) => const AdminLoginScreen(),
              '/admin': (context) => const PremiumAdminDashboardScreen(),
              '/team-profile': (context) {
                final teamName = ModalRoute.of(context)?.settings.arguments as String? ?? 'Gujarat Gems';
                // Create a simple TeamProfileData object with placeholder data
                final teamData = TeamProfileData(
                  name: teamName,
                  logo: AppConstants.teamLogos[teamName] ?? '',
                  tagline: 'Rising to Glory',
                  founded: 2024,
                  coach: 'Head Coach',
                  captain: 'Team Captain',
                  homeGround: 'Home Stadium',
                  played: 0,
                  won: 0,
                  lost: 0,
                  points: 0,
                  raidPoints: 0,
                  tacklePoints: 0,
                  superRaids: 0,
                  superTackles: 0,
                  allOuts: 0,
                  players: const [],
                  achievements: const [],
                  recentMatches: const [],
                  gallery: const [],
                  videos: const [],
                  sponsors: const [],
                  socialMedia: const {},
                );
                return TeamProfileScreen(team: teamData);
              },
            },
          );
        },
      ),
    );
  }
}

class PlaceholderScreen extends StatelessWidget {
  final String title;
  
  const PlaceholderScreen({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        title: Text(title, style: const TextStyle(color: Colors.white)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _buildContent(title),
    );
  }

  Widget _buildContent(String title) {
    switch (title) {
      case 'About IWKL':
        return _buildAboutContent();
      case 'Membership':
        return _buildMembershipContent();
      case 'Downloads':
        return _buildDownloadsContent();
      case 'Forgot Password':
        return _buildForgotPasswordContent();
      default:
        return _buildDefaultContent();
    }
  }

  Widget _buildAboutContent() {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'About IWKL',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'Indian Women\'s Kabaddi League (IWKL) is the premier professional kabaddi league for women in India. Founded with the vision of promoting women\'s sports and empowering female athletes, IWKL brings together the best talent from across the country.',
            style: TextStyle(color: Colors.white70, fontSize: 16),
          ),
          const SizedBox(height: 20),
          const Text(
            'Our Mission',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 10),
          const Text(
            'To provide a world-class platform for women kabaddi players to showcase their talent and inspire the next generation of athletes.',
            style: TextStyle(color: Colors.white70, fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildMembershipContent() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.card_membership, color: Colors.amber, size: 80),
          SizedBox(height: 20),
          Text(
            'Membership Plans',
            style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 10),
          Text(
            'Coming Soon',
            style: TextStyle(color: Colors.white70, fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildDownloadsContent() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.download, color: Colors.amber, size: 80),
          SizedBox(height: 20),
          Text(
            'Downloads',
            style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 10),
          Text(
            'No downloads available',
            style: TextStyle(color: Colors.white70, fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildForgotPasswordContent() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.lock_reset, color: Colors.amber, size: 80),
          SizedBox(height: 20),
          Text(
            'Password Reset',
            style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 10),
          Text(
            'Use the Forgot Password screen',
            style: TextStyle(color: Colors.white70, fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildDefaultContent() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.construction, color: Colors.amber, size: 80),
          const SizedBox(height: 20),
          Text(
            title,
            style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          const Text(
            'Under Construction',
            style: TextStyle(color: Colors.white70, fontSize: 16),
          ),
        ],
      ),
    );
  }
}
