import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:ui';
import 'core/theme/app_theme.dart';
import 'core/constants/app_constants.dart';
import 'core/widgets/glass_card.dart';
import 'core/widgets/premium_background.dart';
import 'core/widgets/premium_icon.dart';
import 'features/team/presentation/screens/team_profile_screen.dart';
import 'features/home/presentation/bloc/home_bloc.dart';
import 'features/home/presentation/bloc/home_event.dart';
import 'features/home/presentation/bloc/home_state.dart';
import 'features/home/data/repositories/home_repository_impl.dart';
import 'core/network/api_client.dart';
import 'features/home/domain/usecases/load_home_data_usecase.dart';
import 'features/live/presentation/screens/live_screen.dart';
import 'features/ott/presentation/screens/ott_screen.dart';
import 'features/news/presentation/screens/news_screen.dart';
import 'features/profile/presentation/screens/profile_screen.dart';

void main() async {
  final prefs = await SharedPreferences.getInstance();
  runApp(IWKLApp(preferences: prefs));
}

class IWKLApp extends StatelessWidget {
  final SharedPreferences preferences;
  
  const IWKLApp({super.key, required this.preferences});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'IWKL',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: BlocProvider(
        create: (context) => HomeBloc(
          LoadHomeDataUseCase(HomeRepositoryImpl(ApiClient(preferences))),
        )..add(LoadHomeData()),
        child: const PremiumHomeScreen(),
      ),
      onGenerateRoute: (settings) {
        return PageRouteBuilder(
          settings: settings,
          pageBuilder: (context, animation, secondaryAnimation) {
            switch (settings.name) {
              case '/':
                return BlocProvider(
                  create: (context) => HomeBloc(
                    LoadHomeDataUseCase(HomeRepositoryImpl(ApiClient(preferences))),
                  )..add(LoadHomeData()),
                  child: const PremiumHomeScreen(),
                );
              case '/profile':
                return ProfileScreen(user: UserProfileData(
                  name: 'User',
                  email: 'user@example.com',
                  avatar: null,
                  isPremium: false,
                  favoriteCount: 0,
                  achievements: [],
                  favoriteTeam: null,
                  language: 'English',
                  theme: 'Dark',
                  notificationsEnabled: true,
                ));
              default:
                return BlocProvider(
                  create: (context) => HomeBloc(
                    LoadHomeDataUseCase(HomeRepositoryImpl(ApiClient(preferences))),
                  )..add(LoadHomeData()),
                  child: const PremiumHomeScreen(),
                );
            }
          },
          transitionDuration: const Duration(milliseconds: 300),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            const begin = Offset(1.0, 0.0);
            const end = Offset.zero;
            const curve = Curves.easeInOut;

            var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
            var offsetAnimation = animation.drive(tween);

            return SlideTransition(
              position: offsetAnimation,
              child: FadeTransition(
                opacity: animation,
                child: child,
              ),
            );
          },
        );
      },
    );
  }
}

class PremiumHomeScreen extends StatefulWidget {
  const PremiumHomeScreen({super.key});

  @override
  State<PremiumHomeScreen> createState() => _PremiumHomeScreenState();
}

class _PremiumHomeScreenState extends State<PremiumHomeScreen> {
  int _currentIndex = 0;
  int _notificationCount = 3;
  int _expandedTeamIndex = -1;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        if (state is HomeLoading) {
          return Scaffold(
            backgroundColor: const Color(AppConstants.backgroundColorValue),
            body: const Center(
              child: CircularProgressIndicator(color: Color(AppConstants.accentColorValue)),
            ),
          );
        } else if (state is HomeError) {
          // Show error but still build the screen with fallback data
          return _buildHomeScreen(null);
        } else if (state is HomeLoaded) {
          return _buildHomeScreen(state);
        }
        return _buildHomeScreen(null);
      },
    );
  }

  Widget _buildHomeScreen(HomeState? state) {
    return PremiumBackground(
      child: Scaffold(
        backgroundColor: Colors.transparent,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                const Color(AppConstants.primaryColorValue).withOpacity(0.8),
                Colors.transparent,
              ],
            ),
          ),
        ),
        title: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/logo/iwkl_logo.png',
              height: 55,
              errorBuilder: (context, error, stackTrace) {
                return const Icon(Icons.sports_kabaddi, size: 55, color: Color(AppConstants.accentColorValue));
              },
            ),
          ],
        ),
        leading: Builder(
          builder: (context) {
            return IconButton(
              icon: PremiumIcon(icon: Icons.menu, color: Colors.white),
              onPressed: () {
                Scaffold.of(context).openDrawer();
              },
            );
          },
        ),
        actions: [
          IconButton(
            icon: PremiumIcon(icon: Icons.search, color: Colors.white),
            onPressed: () {},
          ),
          Stack(
            children: [
              IconButton(
                icon: PremiumIcon(icon: Icons.notifications_outlined, color: Colors.white),
                onPressed: () {},
              ),
              if (_notificationCount > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Color(AppConstants.accentColorValue),
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      '$_notificationCount',
                      style: const TextStyle(
                        color: Colors.black,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Story Section
            _buildStorySection(),
            const SizedBox(height: 16),

            // Hero Banner
            _buildHeroBanner(),
            const SizedBox(height: 24),

            // Live Now
            _buildLiveMatch(),
            const SizedBox(height: 24),

            // Upcoming Matches
            _buildUpcomingMatches(),
            const SizedBox(height: 24),

            // Top Performers
            _buildTopPerformers(),
            const SizedBox(height: 24),

            // Team Standings
            _buildTeamStandings(),
            const SizedBox(height: 24),

            // Latest News
            _buildLatestNews(),
            const SizedBox(height: 24),

            // Featured Videos
            _buildFeaturedVideos(),
            const SizedBox(height: 24),

            // Gallery
            _buildGallery(),
            const SizedBox(height: 24),

            // Fan Poll
            _buildFanPoll(),
            const SizedBox(height: 100),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNav(),
      drawer: _buildDrawer(),
      ),
    );
  }

  Widget _buildStorySection() {
    return SizedBox(
      height: 90,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: 5,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Column(
              children: [
                Container(
                  width: 65,
                  height: 65,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(AppConstants.accentColorValue), width: 3),
                  ),
                  child: ClipOval(
                    child: Image.asset(
                      AppConstants.teamLogos[AppConstants.allTeams[index]] ?? '',
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return const Icon(Icons.sports_cricket, color: Colors.white);
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  AppConstants.allTeams[index],
                  style: const TextStyle(color: Colors.white, fontSize: 10),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildHeroBanner() {
    return Container(
      height: 200,
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF4C085D).withOpacity(0.4),
            blurRadius: 30,
            spreadRadius: 5,
            offset: const Offset(0, 15),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(30),
        child: Stack(
          children: [
            Image.asset(
              AppConstants.heroBannerPath,
              fit: BoxFit.cover,
              width: double.infinity,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        const Color(AppConstants.primaryColorValue),
                        const Color(AppConstants.secondaryColorValue),
                      ],
                    ),
                  ),
                );
              },
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withOpacity(0.6),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLiveMatch() {
    return GlassCard(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(24),
      borderRadius: BorderRadius.circular(30),
      premiumStyle: true,
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              const Color(0xFF4C085D).withOpacity(0.3),
              Colors.transparent,
            ],
          ),
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Colors.red, Colors.redAccent]),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.red.withOpacity(0.5),
                        blurRadius: 15,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: const Row(
                    children: [
                      SizedBox(
                        width: 14,
                        height: 14,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      ),
                      SizedBox(width: 8),
                      Text('LIVE NOW', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 1)),
                    ],
                  ),
                ),
                const Text('Mumbai Arena', style: TextStyle(color: Colors.white70, fontSize: 14, letterSpacing: 0.5)),
              ],
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildTeamScore('Punjab Wings', 'assets/teams/punjab_wings.jpeg', 25, true),
                Column(
                  children: [
                    const Row(
                      children: [
                        Text('25', style: TextStyle(color: Colors.white, fontSize: 48, fontWeight: FontWeight.bold, letterSpacing: 2)),
                        Text(' - ', style: TextStyle(color: Colors.white, fontSize: 48, fontWeight: FontWeight.bold)),
                        Text('20', style: TextStyle(color: Colors.white, fontSize: 48, fontWeight: FontWeight.bold, letterSpacing: 2)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            const Color(AppConstants.accentColorValue),
                            const Color(AppConstants.accentColorValue).withOpacity(0.7),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(25),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(AppConstants.accentColorValue).withOpacity(0.5),
                            blurRadius: 20,
                            spreadRadius: 2,
                          ),
                        ],
                      ),
                      child: const Text(
                        '5 min left',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),
                _buildTeamScore('Delhi Warriors', 'assets/teams/delhi_warriors.jpeg', 20, false),
              ],
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(AppConstants.accentColorValue),
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
                elevation: 10,
                shadowColor: const Color(AppConstants.accentColorValue).withOpacity(0.5),
              ),
              child: const Text(
                'Watch Live',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTeamScore(String teamName, String logoPath, int score, bool isHome) {
    return Column(
      children: [
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: const Color(AppConstants.accentColorValue), width: 3),
            boxShadow: [
              BoxShadow(
                color: const Color(AppConstants.accentColorValue).withOpacity(0.4),
                blurRadius: 20,
                spreadRadius: 3,
              ),
            ],
          ),
          child: ClipOval(
            child: Image.asset(
              logoPath,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return const Icon(Icons.sports_cricket, color: Colors.white);
              },
            ),
          ),
        ),
        const SizedBox(height: 12),
        Text(
          teamName,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 14,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: isHome
                  ? [const Color(AppConstants.accentColorValue), const Color(AppConstants.accentColorValue).withOpacity(0.7)]
                  : [Colors.white.withOpacity(0.2), Colors.white.withOpacity(0.1)],
            ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: const Color(AppConstants.accentColorValue).withOpacity(0.4),
                blurRadius: 15,
                spreadRadius: 2,
              ),
            ],
          ),
          child: Text(
            '$score',
            style: TextStyle(
              color: isHome ? Colors.black : Colors.white,
              fontSize: 32,
              fontWeight: FontWeight.bold,
              letterSpacing: 1,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildUpcomingMatches() {
    return Column(
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Upcoming Matches',
            style: TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 180,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: 3,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(right: 12),
                child: _buildMatchCard(index),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildMatchCard(int index) {
    final teams = [
      ['Mumbai Strikers', 'Kashmiri Queens', 'assets/teams/mumbai_strikers.jpeg', 'assets/teams/kashmiri_queens.jpeg'],
      ['Gujrat Gems', 'Ayodhya Shakti', 'assets/teams/gujrat_gems.jpeg', 'assets/teams/ayodhya_shakti.jpeg'],
      ['Namma Bengaluru', 'Haryanvi Fighters', 'assets/teams/namma_bengaluru.jpeg', 'assets/teams/haryanvi_fighters.jpeg'],
    ];
    final times = ['Today, 7:30 PM', 'Tomorrow, 6:00 PM', 'Tomorrow, 8:30 PM'];
    
    return GlassCard(
      padding: const EdgeInsets.all(16),
      borderRadius: BorderRadius.circular(30),
      width: 280,
      premiumStyle: true,
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white.withOpacity(0.3), width: 2),
                    ),
                    child: ClipOval(
                      child: Image.asset(
                        teams[index][2],
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return const Icon(Icons.sports_cricket, color: Colors.white);
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    teams[index][0],
                    style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
              const Text('VS', style: TextStyle(color: Color(AppConstants.accentColorValue), fontWeight: FontWeight.bold)),
              Column(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white.withOpacity(0.3), width: 2),
                    ),
                    child: ClipOval(
                      child: Image.asset(
                        teams[index][3],
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return const Icon(Icons.sports_cricket, color: Colors.white);
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    teams[index][1],
                    style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(AppConstants.accentColorValue).withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              times[index],
              style: const TextStyle(color: Color(AppConstants.accentColorValue), fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopPerformers() {
    return Column(
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Top Performers',
            style: TextStyle(
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.2,
            ),
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildPlayerSection('Top Raiders', [
                _buildPlayerCard('Rahul Kumar', 'Punjab Wings', 45, Colors.orange),
                _buildPlayerCard('Vikash Kandola', 'Delhi Warriors', 42, Colors.blue),
              ]),
            ),
            Expanded(
              child: _buildPlayerSection('Top Defenders', [
                _buildPlayerCard('Fazel Atrachali', 'Gujrat Gems', 38, Colors.teal),
                _buildPlayerCard('Surjeet Singh', 'Mumbai Strikers', 35, Colors.red),
              ]),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildPlayerSection(String title, List<Widget> players) {
    return Column(
      children: [
        Text(
          title,
          style: TextStyle(
            color: const Color(AppConstants.accentColorValue),
            fontSize: 18,
            fontWeight: FontWeight.bold,
            letterSpacing: 1,
          ),
        ),
        const SizedBox(height: 12),
        ...players,
      ],
    );
  }

  Widget _buildPlayerCard(String name, String team, int points, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      child: GlassCard(
        padding: const EdgeInsets.all(16),
        borderRadius: BorderRadius.circular(25),
        premiumStyle: true,
        child: Row(
          children: [
            Container(
              width: 55,
              height: 55,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [color, color.withOpacity(0.7)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(15),
                boxShadow: [
                  BoxShadow(
                    color: color.withOpacity(0.4),
                    blurRadius: 15,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: const Icon(Icons.person, color: Colors.white, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, letterSpacing: 0.5)),
                  const SizedBox(height: 4),
                  Text(team, style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12)),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    const Color(AppConstants.accentColorValue),
                    const Color(AppConstants.accentColorValue).withOpacity(0.7),
                  ],
                ),
                borderRadius: BorderRadius.circular(15),
                boxShadow: [
                  BoxShadow(
                    color: const Color(AppConstants.accentColorValue).withOpacity(0.4),
                    blurRadius: 10,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Text(
                '$points',
                style: const TextStyle(
                  color: Colors.black,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTeamStandings() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Points Table',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              TextButton(
                onPressed: () {
                  // Navigate to all teams page
                },
                child: const Text(
                  'View All Teams',
                  style: TextStyle(color: Color(AppConstants.accentColorValue)),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        ...List.generate(4, (index) {
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: GlassCard(
              padding: EdgeInsets.zero,
              borderRadius: BorderRadius.circular(30),
              premiumStyle: true,
              child: Column(
                children: [
                  InkWell(
                    onTap: () {
                      setState(() {
                        _expandedTeamIndex = _expandedTeamIndex == index ? -1 : index;
                      });
                    },
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: index == 0
                                    ? [const Color(AppConstants.accentColorValue), const Color(AppConstants.accentColorValue).withOpacity(0.7)]
                                    : [Colors.white.withOpacity(0.2), Colors.white.withOpacity(0.1)],
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Center(
                              child: Text(
                                '${index + 1}',
                                style: TextStyle(
                                  color: index == 0 ? Colors.black : Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Container(
                            width: 50,
                            height: 50,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: const Color(AppConstants.accentColorValue), width: 2),
                            ),
                            child: ClipOval(
                              child: Image.asset(
                                AppConstants.teamLogos[AppConstants.allTeams[index]] ?? '',
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) {
                                  return const Icon(Icons.sports_cricket, color: Colors.white);
                                },
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(AppConstants.allTeams[index], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                Text('10 Matches', style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: index == 0
                                    ? [const Color(AppConstants.accentColorValue), const Color(AppConstants.accentColorValue).withOpacity(0.7)]
                                    : [Colors.white.withOpacity(0.2), Colors.white.withOpacity(0.1)],
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              '${16 - index * 2}',
                              style: TextStyle(
                                color: index == 0 ? Colors.black : Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Icon(
                            _expandedTeamIndex == index ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                            color: Colors.white,
                          ),
                        ],
                      ),
                    ),
                  ),
                  if (_expandedTeamIndex == index)
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Divider(color: Colors.white24),
                          const SizedBox(height: 12),
                          _buildTeamDetailRow('Coach', 'Rajesh Kumar'),
                          _buildTeamDetailRow('Captain', 'Vikram Singh'),
                          _buildTeamDetailRow('Home Ground', 'Mumbai Arena'),
                          const SizedBox(height: 12),
                          const Text(
                            'Season Statistics',
                            style: TextStyle(color: Color(AppConstants.accentColorValue), fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              _buildStatItem('Matches', '10'),
                              _buildStatItem('Wins', '7'),
                              _buildStatItem('Losses', '3'),
                              _buildStatItem('Points', '${16 - index * 2}'),
                            ],
                          ),
                          const SizedBox(height: 12),
                          const Divider(color: Colors.white24),
                          const SizedBox(height: 12),
                          const Text(
                            'Recent Matches',
                            style: TextStyle(color: Color(AppConstants.accentColorValue), fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 8),
                          _buildRecentMatch('vs Delhi Warriors', 'Won 35-28'),
                          _buildRecentMatch('vs Gujrat Gems', 'Lost 30-32'),
                          const SizedBox(height: 12),
                          InkWell(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => TeamProfileScreen(
                                    team: TeamProfileData(
                                      name: AppConstants.allTeams[index],
                                      logo: AppConstants.teamLogos[AppConstants.allTeams[index]],
                                      founded: 2018,
                                      coach: 'Rajesh Kumar',
                                      captain: 'Vikram Singh',
                                      homeGround: 'Mumbai Arena',
                                      played: 10,
                                      won: 7,
                                      lost: 3,
                                      points: 16 - index * 2,
                                      raidPoints: 150,
                                      tacklePoints: 120,
                                      superRaids: 15,
                                      superTackles: 10,
                                      allOuts: 5,
                                      players: [
                                        PlayerData(name: 'Player 1', role: 'Raider', jerseyNumber: 1),
                                        PlayerData(name: 'Player 2', role: 'Defender', jerseyNumber: 2),
                                        PlayerData(name: 'Player 3', role: 'All-Rounder', jerseyNumber: 3),
                                      ],
                                      achievements: [
                                        'Season 2025 Champions',
                                        'Best Team Defense',
                                      ],
                                      recentMatches: [
                                        MatchData(opponent: 'Delhi Warriors', date: 'Jan 15, 2026', result: 'Won 35-28', won: true),
                                        MatchData(opponent: 'Gujrat Gems', date: 'Jan 10, 2026', result: 'Lost 30-32', won: false),
                                      ],
                                      gallery: [
                                        'assets/images/gallery1.jpg',
                                        'assets/images/gallery2.jpg',
                                        'assets/images/gallery3.jpg',
                                      ],
                                      videos: [
                                        VideoData(title: 'Match Highlights', duration: '10:30'),
                                        VideoData(title: 'Team Interview', duration: '15:45'),
                                      ],
                                      sponsors: [
                                        'assets/sponsors/sponsor1.png',
                                        'assets/sponsors/sponsor2.png',
                                      ],
                                      socialMedia: {
                                        'facebook': 'https://facebook.com/team',
                                        'instagram': 'https://instagram.com/team',
                                        'twitter': 'https://twitter.com/team',
                                        'youtube': 'https://youtube.com/team',
                                      },
                                    ),
                                  ),
                                ),
                              );
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    const Color(AppConstants.accentColorValue),
                                    const Color(AppConstants.accentColorValue).withOpacity(0.7),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Center(
                                child: Text(
                                  'View Team Profile',
                                  style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  Widget _buildTeamDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Text(
            '$label: ',
            style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 14),
          ),
          Text(
            value,
            style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
        Text(
          label,
          style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12),
        ),
      ],
    );
  }

  Widget _buildRecentMatch(String opponent, String result) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            opponent,
            style: const TextStyle(color: Colors.white, fontSize: 14),
          ),
          Text(
            result,
            style: TextStyle(
              color: result.contains('Won') ? Colors.green : Colors.red,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLatestNews() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Latest News',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              TextButton(
                onPressed: () {
                  // Navigate to all news page
                },
                child: const Text(
                  'View All',
                  style: TextStyle(color: Color(AppConstants.accentColorValue)),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 220,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: 3,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(right: 12),
                child: _buildNewsCard(index),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildNewsCard(int index) {
    final titles = [
      'Punjab Wings clinch thriller against Delhi',
      'Mumbai Strikers sign new star raider',
      'Kashmiri Queens dominate in 40-point victory',
    ];
    
    return GlassCard(
      padding: EdgeInsets.zero,
      borderRadius: BorderRadius.circular(30),
      width: 300,
      premiumStyle: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 160,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF4C085D).withOpacity(0.5),
                  const Color(0xFF2D0A3D).withOpacity(0.3),
                ],
              ),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
            ),
            child: const Center(child: Icon(Icons.article, size: 60, color: Colors.white54)),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titles[index],
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, letterSpacing: 0.5),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.calendar_today, size: 14, color: Colors.white54),
                    const SizedBox(width: 6),
                    Text('${index + 2}h ago', style: const TextStyle(color: Colors.white54, fontSize: 12)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturedVideos() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Featured Videos',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              TextButton(
                onPressed: () {
                  // Navigate to all news page
                },
                child: const Text(
                  'View All',
                  style: TextStyle(color: Color(AppConstants.accentColorValue)),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 220,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: 3,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(right: 12),
                child: _buildVideoCard(index),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildVideoCard(int index) {
    final titles = [
      'Top 5 Raids of the Week',
      'Match Highlights: Punjab vs Delhi',
      'Best Tackles of Season 2026',
    ];
    
    return GlassCard(
      padding: EdgeInsets.zero,
      borderRadius: BorderRadius.circular(30),
      width: 300,
      premiumStyle: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 160,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF4C085D).withOpacity(0.5),
                  const Color(0xFF2D0A3D).withOpacity(0.3),
                ],
              ),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
            ),
            child: const Center(
              child: Icon(Icons.play_circle_outline, size: 60, color: Colors.white54),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titles[index],
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, letterSpacing: 0.5),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.visibility, size: 14, color: Colors.white54),
                    const SizedBox(width: 6),
                    Text('${(20 + index * 10)}K views', style: const TextStyle(color: Colors.white54, fontSize: 12)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGallery() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Gallery',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              TextButton(
                onPressed: () {
                  // Navigate to all news page
                },
                child: const Text(
                  'View All',
                  style: TextStyle(color: Color(AppConstants.accentColorValue)),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1,
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: 4,
          itemBuilder: (context, index) {
            return GlassCard(
              padding: EdgeInsets.zero,
              borderRadius: BorderRadius.circular(30),
              premiumStyle: true,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF4C085D).withOpacity(0.5),
                      const Color(0xFF2D0A3D).withOpacity(0.3),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: const Center(child: Icon(Icons.image, size: 50, color: Colors.white54)),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildFanPoll() {
    return GlassCard(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      borderRadius: BorderRadius.circular(30),
      premiumStyle: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              PremiumIcon(icon: Icons.poll, color: Color(AppConstants.accentColorValue)),
              SizedBox(width: 8),
              Text(
                'Fan Poll',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'Who will win today\'s match?',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          _buildPollOption('Punjab Wings', 65),
          const SizedBox(height: 12),
          _buildPollOption('Delhi Warriors', 35),
        ],
      ),
    );
  }

  Widget _buildPollOption(String team, int percentage) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              team,
              style: const TextStyle(color: Colors.white, fontSize: 14),
            ),
            Text(
              '$percentage%',
              style: const TextStyle(color: Color(AppConstants.accentColorValue), fontSize: 14, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Container(
          height: 8,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.1),
            borderRadius: BorderRadius.circular(4),
          ),
          child: FractionallySizedBox(
            widthFactor: percentage / 100,
            alignment: Alignment.centerLeft,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    const Color(AppConstants.accentColorValue),
                    const Color(AppConstants.accentColorValue).withOpacity(0.7),
                  ],
                ),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBottomNav() {
    return Container(
      height: 90,
      margin: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(0xFF4C085D).withOpacity(0.3),
            const Color(0xFF2D0A3D).withOpacity(0.4),
          ],
        ),
        borderRadius: BorderRadius.circular(35),
        border: Border.all(
          color: const Color(AppConstants.accentColorValue).withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF4C085D).withOpacity(0.4),
            blurRadius: 30,
            spreadRadius: 5,
            offset: const Offset(0, 15),
          ),
          BoxShadow(
            color: const Color(AppConstants.accentColorValue).withOpacity(0.2),
            blurRadius: 20,
            spreadRadius: 2,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(35),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(Icons.home, 'Home', 0),
              _buildNavItem(Icons.sports_cricket, 'Live', 1),
              _buildNavItem(Icons.play_circle, 'OTT', 2),
              _buildNavItem(Icons.newspaper, 'News', 3),
              _buildNavItem(Icons.person, 'Profile', 4),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, int index) {
    final isActive = _currentIndex == index;
    return GestureDetector(
      onTap: () {
        setState(() {
          _currentIndex = index;
        });
        // Navigation logic
        switch (index) {
          case 0: // Home - already on home
            break;
          case 1: // Live
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const LiveScreen()),
            );
            break;
          case 2: // OTT
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const OTTScreen()),
            );
            break;
          case 3: // News
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const NewsScreen()),
            );
            break;
          case 4: // Profile
            Navigator.pushNamed(context, '/profile');
            break;
        }
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: isActive
              ? LinearGradient(
                  colors: [
                    const Color(AppConstants.accentColorValue),
                    const Color(AppConstants.accentColorValue).withOpacity(0.7),
                  ],
                )
              : null,
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: const Color(AppConstants.accentColorValue).withOpacity(0.5),
                    blurRadius: 20,
                    spreadRadius: 3,
                    offset: const Offset(0, 5),
                  ),
                ]
              : null,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedScale(
              scale: isActive ? 1.2 : 1.0,
              duration: const Duration(milliseconds: 300),
              child: PremiumIcon(
                icon: icon,
                color: isActive ? Colors.black : Colors.white.withOpacity(0.6),
                size: 26,
              ),
            ),
            const SizedBox(height: 6),
            AnimatedOpacity(
              opacity: isActive ? 1.0 : 0.6,
              duration: const Duration(milliseconds: 300),
              child: Text(label, style: TextStyle(color: isActive ? Colors.black : Colors.white.withOpacity(0.6), fontSize: 12, fontWeight: isActive ? FontWeight.bold : FontWeight.normal)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawer() {
    return Drawer(
      backgroundColor: const Color(AppConstants.primaryColorValue),
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(color: const Color(AppConstants.primaryColorValue)),
            child: Column(
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(AppConstants.accentColorValue), width: 3),
                  ),
                  child: const Icon(Icons.person, size: 40, color: Colors.white),
                ),
                const SizedBox(height: 16),
                const Text('Shivam Dubey', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        const Color(AppConstants.accentColorValue),
                        const Color(AppConstants.accentColorValue).withOpacity(0.7),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.workspace_premium, size: 16, color: Colors.black),
                      SizedBox(width: 6),
                      Text('Premium Member', style: TextStyle(color: Colors.black, fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          _buildDrawerItem(Icons.home, 'Home'),
          _buildDrawerItem(Icons.sports_cricket, 'Live Match'),
          _buildDrawerItem(Icons.play_circle, 'OTT'),
          _buildDrawerItem(Icons.groups, 'Teams'),
          _buildDrawerItem(Icons.person, 'Players'),
          _buildDrawerItem(Icons.calendar_month, 'Schedule'),
          _buildDrawerItem(Icons.leaderboard, 'Points Table'),
          _buildDrawerItem(Icons.photo_library, 'Gallery'),
          _buildDrawerItem(Icons.article, 'News'),
          _buildDrawerItem(Icons.favorite, 'Fan Club'),
          _buildDrawerItem(Icons.notifications, 'Notifications'),
          _buildDrawerItem(Icons.account_circle, 'Profile'),
          _buildDrawerItem(Icons.settings, 'Settings'),
          _buildDrawerItem(Icons.info, 'About'),
          _buildDrawerItem(Icons.support_agent, 'Support'),
          const Divider(color: Colors.white24),
          _buildDrawerItem(Icons.logout, 'Logout'),
        ],
      ),
    );
  }

  Widget _buildDrawerItem(IconData icon, String title) {
    return ListTile(
      leading: Icon(icon, color: Colors.white),
      title: Text(title, style: const TextStyle(color: Colors.white)),
      onTap: () {
        Navigator.pop(context);
        switch (title) {
          case 'Home':
            // Already on home
            break;
          case 'Live Match':
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const LiveScreen()),
            );
            break;
          case 'OTT':
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const OTTScreen()),
            );
            break;
          case 'Teams':
            // Navigate to teams screen
            break;
          case 'Players':
            // Navigate to players screen
            break;
          case 'Schedule':
            // Navigate to schedule screen
            break;
          case 'Points Table':
            // Navigate to points table screen
            break;
          case 'Gallery':
            // Navigate to gallery screen
            break;
          case 'News':
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const NewsScreen()),
            );
            break;
          case 'Fan Club':
            // Navigate to fan club screen
            break;
          case 'Notifications':
            // Navigate to notifications screen
            break;
          case 'Profile':
            Navigator.pushNamed(context, '/profile');
            break;
          case 'Settings':
            // Navigate to settings screen
            break;
          case 'About':
            // Navigate to about screen
            break;
          case 'Support':
            // Navigate to support screen
            break;
          case 'Logout':
            // Handle logout
            break;
        }
      },
    );
  }
}
