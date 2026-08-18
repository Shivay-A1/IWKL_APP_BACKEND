import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../../core/widgets/premium_drawer.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/theme/theme_provider.dart';
import '../widgets/premium_story_card.dart';
import '../widgets/premium_live_match_card.dart';
import '../widgets/premium_bottom_navigation.dart';
import '../bloc/home_bloc.dart';
import '../bloc/home_event.dart';
import '../bloc/home_state.dart';
import 'video_player_screen.dart';

class PremiumHomeScreen extends StatefulWidget {
  const PremiumHomeScreen({super.key});

  @override
  State<PremiumHomeScreen> createState() => _PremiumHomeScreenState();
}

class _PremiumHomeScreenState extends State<PremiumHomeScreen> with AutomaticKeepAliveClientMixin {
  int _currentIndex = 0;

  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDarkMode = themeProvider.isDarkMode;
    
    return Scaffold(
      backgroundColor: isDarkMode ? AppDesignSystem.primaryBackground : Colors.grey[100],
      drawer: const PremiumDrawer(),
      body: SafeArea(
        child: Column(
          children: [
            // Premium Header with Logo Image
            _buildPremiumHeader(),
            // Content
            Expanded(
              child: BlocBuilder<HomeBloc, HomeState>(
                buildWhen: (previous, current) => previous.runtimeType != current.runtimeType,
                builder: (context, state) {
                  if (state is HomeLoading) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (state is HomeLoaded) {
                    return SingleChildScrollView(
                      physics: const BouncingScrollPhysics(),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: AppDesignSystem.mdSpacing),
                          
                          // Stories Section (3 lines horizontally scrollable)
                          _buildStoriesSection(state.stories),
                          const SizedBox(height: AppDesignSystem.lgSpacing),
                          
                          // Hero Banner (Immediately after stories)
                          _buildHeroBanner(state.sliders),
                          const SizedBox(height: AppDesignSystem.lgSpacing),
                          
                          // Live Match Card with Real Team Logos and Names
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
                            child: _buildLiveMatchCard({
                              'team1': 'Garvi Gujarat',
                              'team2': 'Mumbai Strikers',
                              'team1Logo': 'assets/teams/garvi_gujarat.png',
                              'team2Logo': 'assets/teams/mumbai_strikers.jpeg',
                              'score1': '35',
                              'score2': '32',
                              'time': 'LIVE',
                              'venue': 'Indoor Stadium, Mumbai',
                            }),
                          ),
                          const SizedBox(height: AppDesignSystem.lgSpacing),
                          
                          // Quick Actions with Logo Icons (Horizontal Scroll)
                          _buildQuickActionsHorizontal(),
                          const SizedBox(height: AppDesignSystem.lgSpacing),
                          
                          // Upcoming Matches
                          _buildUpcomingMatches(state.upcomingMatches),
                          const SizedBox(height: AppDesignSystem.lgSpacing),
                          
                          // OTT Section
                          _buildOTTSection(state.videos),
                          const SizedBox(height: AppDesignSystem.lgSpacing),
                          
                          // Points Table
                          _buildPointsTable(state.pointsTable),
                          const SizedBox(height: AppDesignSystem.lgSpacing),
                          
                          // Top Videos
                          _buildTopVideos(state.videos),
                          const SizedBox(height: AppDesignSystem.lgSpacing),
                          
                          // Latest News
                          _buildLatestNews(state.news),
                          const SizedBox(height: AppDesignSystem.lgSpacing),
                          
                          // Gallery Preview
                          _buildGalleryPreview(),
                          const SizedBox(height: AppDesignSystem.lgSpacing),
                          
                          // Fan Club Banner (at the very end)
                          _buildFanClubBanner(),
                          const SizedBox(height: AppDesignSystem.xlSpacing + 100),
                        ],
                      ),
                    );
                  } else if (state is HomeError) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.error_outline, size: 64, color: Colors.red),
                          const SizedBox(height: 16),
                          Text(state.message, style: AppDesignSystem.readableBody),
                          const SizedBox(height: 16),
                          PremiumButton(
                            text: 'Retry',
                            onPressed: () => context.read<HomeBloc>().add(LoadHomeData()),
                          ),
                        ],
                      ),
                    );
                  }
                  return const SizedBox.shrink();
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: Container(
        margin: const EdgeInsets.only(bottom: 20),
        child: PremiumBottomNavigation(
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() => _currentIndex = index);
            switch (index) {
              case 0:
                break;
              case 1:
                Navigator.pushNamed(context, '/live-match');
                break;
              case 2:
                Navigator.pushNamed(context, '/ott');
                break;
              case 3:
                Navigator.pushNamed(context, '/teams');
                break;
              case 4:
                Navigator.pushNamed(context, '/profile');
                break;
            }
          },
        ),
      ),
    );
  }

  Widget _buildPremiumHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppDesignSystem.mdSpacing,
        vertical: AppDesignSystem.smSpacing,
      ),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppDesignSystem.primaryBackground.withValues(alpha: 0.98),
            AppDesignSystem.cardBackground.withValues(alpha: 0.95),
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        border: Border(
          bottom: BorderSide(
            color: AppDesignSystem.primaryPurple.withValues(alpha: 0.4),
            width: 1,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: AppDesignSystem.primaryPurple.withValues(alpha: 0.15),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Drawer Icon with GlobalKey
          Builder(
            builder: (context) => IconButton(
              icon: Icon(Icons.menu, color: AppDesignSystem.getPrimaryText(context), size: 26),
              onPressed: () => Scaffold.of(context).openDrawer(),
            ),
          ),
          const SizedBox(width: AppDesignSystem.smSpacing),
          
          // IWKL Logo Image (Centered)
          Expanded(
            child: Center(
              child: Image.asset(
                'assets/IWKL-FINAL-LOGO_2.png',
                height: 50,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: AppDesignSystem.primaryGradient,
                      boxShadow: [
                        BoxShadow(
                          color: AppDesignSystem.primaryPurple.withValues(alpha: 0.6),
                          blurRadius: 15,
                          spreadRadius: 3,
                        ),
                      ],
                    ),
                    child: Icon(Icons.sports_kabaddi, color: AppDesignSystem.getPrimaryText(context), size: 28),
                  );
                },
              ),
            ),
          ),
          
          // Search Icon
          IconButton(
            icon: Icon(Icons.search, color: AppDesignSystem.getPrimaryText(context), size: 24),
            onPressed: () => Navigator.pushNamed(context, '/search'),
          ),
          
          // Notifications Icon
          Stack(
            children: [
              IconButton(
                icon: Icon(Icons.notifications_outlined, color: AppDesignSystem.getPrimaryText(context), size: 24),
                onPressed: () => Navigator.pushNamed(context, '/notifications'),
              ),
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppDesignSystem.gold,
                    boxShadow: [
                      BoxShadow(
                        color: AppDesignSystem.gold.withValues(alpha: 0.6),
                        blurRadius: 6,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          
          // Profile Icon
          GestureDetector(
            onTap: () => Navigator.pushNamed(context, '/profile'),
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: AppDesignSystem.primaryGradient,
                border: Border.all(
                  color: AppDesignSystem.gold.withValues(alpha: 0.7),
                  width: 2,
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppDesignSystem.primaryPurple.withValues(alpha: 0.5),
                    blurRadius: 10,
                  ),
                ],
              ),
              child: Icon(Icons.person, color: AppDesignSystem.getPrimaryText(context), size: 20),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStoriesSection(List<dynamic> stories) {
    // Use data from admin panel, fallback to real team names if empty (single line)
    final displayStories = stories.isEmpty 
        ? AppConstants.allTeams.map((teamName) => {
            'title': teamName,
            'imageUrl': AppConstants.teamLogos[teamName] ?? '',
          }).toList()
        : stories;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
          child: Text(
            'Stories',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppDesignSystem.getPrimaryText(context),
              letterSpacing: 0.5,
            ),
          ),
        ),
        const SizedBox(height: AppDesignSystem.mdSpacing),
        // Single Row (1 line only)
        SizedBox(
          height: 100,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
            itemCount: displayStories.length,
            itemBuilder: (context, index) {
              final story = displayStories[index];
              return Padding(
                padding: const EdgeInsets.only(right: AppDesignSystem.mdSpacing),
                child: PremiumStoryCard(
                  title: story['title'] ?? story['teamName'] ?? 'Story',
                  imageUrl: story['imageUrl'] ?? story['image'] ?? '',
                  onTap: () => _openStoryViewer(displayStories, index),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildHeroBanner(List<dynamic> sliders) {
    // Use data from admin panel, fallback to reference image if empty
    if (sliders.isNotEmpty && sliders[0] != null) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
        child: Container(
          height: 180,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
            boxShadow: [
              BoxShadow(
                color: AppDesignSystem.primaryPurple.withValues(alpha: 0.4),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
            child: Image.network(
              sliders[0].toString(),
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  decoration: BoxDecoration(
                    gradient: AppDesignSystem.primaryGradient,
                    borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
                  ),
                  child: Center(
                    child: Text(
                      'Hero Banner',
                      style: TextStyle(
                        color: AppDesignSystem.getPrimaryText(context),
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ),
      );
    }
    
    // Fallback to reference image
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
      child: Container(
        height: 180,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
          boxShadow: [
            BoxShadow(
              color: AppDesignSystem.primaryPurple.withValues(alpha: 0.4),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
          child: Image.asset(
            'assets/banners/hero_banner_reference.png',
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) {
              return Container(
                decoration: BoxDecoration(
                  gradient: AppDesignSystem.primaryGradient,
                  borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
                ),
                child: const Center(
                  child: Text(
                    'Hero Banner',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildLiveMatchCard(dynamic liveMatch) {
    // Handle both old and new data formats
    final team1Name = liveMatch['team1'] ?? liveMatch['team1Name'] ?? AppConstants.allTeams[0];
    final team2Name = liveMatch['team2'] ?? liveMatch['team2Name'] ?? AppConstants.allTeams[1];
    final team1Logo = liveMatch['team1Logo'] ?? AppConstants.teamLogos[team1Name] ?? '';
    final team2Logo = liveMatch['team2Logo'] ?? AppConstants.teamLogos[team2Name] ?? '';
    final team1Score = liveMatch['score1'] ?? liveMatch['team1Score'] ?? 25;
    final team2Score = liveMatch['score2'] ?? liveMatch['team2Score'] ?? 20;
    final venue = liveMatch['venue'] ?? 'Main Stadium';
    final matchTime = liveMatch['time'] ?? liveMatch['matchTime'] ?? 'LIVE';
    
    return PremiumLiveMatchCard(
        team1Name: team1Name,
        team2Name: team2Name,
        team1Logo: team1Logo,
        team2Logo: team2Logo,
        team1Score: team1Score is String ? int.tryParse(team1Score) ?? 25 : team1Score,
        team2Score: team2Score is String ? int.tryParse(team2Score) ?? 20 : team2Score,
        venue: venue,
        matchTime: matchTime,
        onWatch: () => Navigator.pushNamed(context, '/live-match'),
      );
  }

  Widget _buildQuickActionsHorizontal() {
    final actions = [
      {'icon': Icons.sports_kabaddi, 'label': 'Teams', 'route': '/teams'},
      {'icon': Icons.person, 'label': 'Players', 'route': '/players'},
      {'icon': Icons.calendar_today, 'label': 'Fixtures', 'route': '/schedule'},
      {'icon': Icons.table_chart, 'label': 'Points', 'route': '/points-table'},
      {'icon': Icons.play_circle, 'label': 'OTT', 'route': '/ott'},
      {'icon': Icons.photo_library, 'label': 'Gallery', 'route': '/gallery'},
      {'icon': Icons.group, 'label': 'Fan Club', 'route': '/fan-club'},
      {'icon': Icons.article, 'label': 'News', 'route': '/news'},
      {'icon': Icons.notifications, 'label': 'Notifications', 'route': '/notifications'},
    ];

    return SizedBox(
      height: 100,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
        itemCount: actions.length,
        itemBuilder: (context, index) {
          final action = actions[index];
          return Padding(
            padding: const EdgeInsets.only(right: AppDesignSystem.mdSpacing),
            child: _buildQuickActionCard(
              icon: action['icon'] as IconData,
              label: action['label'] as String,
              route: action['route'] as String,
            ),
          );
        },
      ),
    );
  }

  Widget _buildQuickActionCard({
    required IconData icon,
    required String label,
    required String route,
  }) {
    return InkWell(
      onTap: () => Navigator.pushNamed(context, route),
      child: Container(
        width: 90,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              AppDesignSystem.cardBackground,
              AppDesignSystem.secondaryCard,
            ],
          ),
          borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
          border: Border.all(
            color: AppDesignSystem.primaryPurple.withValues(alpha: 0.4),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: AppDesignSystem.primaryPurple.withValues(alpha: 0.25),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: AppDesignSystem.primaryGradient,
                boxShadow: [
                  BoxShadow(
                    color: AppDesignSystem.primaryPurple.withValues(alpha: 0.5),
                    blurRadius: 8,
                  ),
                ],
              ),
              child: Icon(icon, color: AppDesignSystem.getPrimaryText(context), size: 22),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                color: AppDesignSystem.getPrimaryText(context),
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUpcomingMatches(List<dynamic> upcomingMatches) {
    // Use data from admin panel, fallback to generated matches if empty
    final matches = upcomingMatches.isEmpty 
        ? List.generate(5, (index) {
            final team1Index = (index * 2) % AppConstants.allTeams.length;
            final team2Index = (index * 2 + 1) % AppConstants.allTeams.length;
            return {
              'date': 'Aug ${10 + index}',
              'team1': AppConstants.allTeams[team1Index],
              'team2': AppConstants.allTeams[team2Index],
              'team1Logo': AppConstants.teamLogos[AppConstants.allTeams[team1Index]] ?? '',
              'team2Logo': AppConstants.teamLogos[AppConstants.allTeams[team2Index]] ?? '',
              'venue': 'Stadium ${index + 1}',
            };
          })
        : upcomingMatches;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Upcoming Matches',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppDesignSystem.getPrimaryText(context),
                  letterSpacing: 0.5,
                ),
              ),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, '/schedule'),
                child: Text(
                  'View All',
                  style: TextStyle(
                    color: AppDesignSystem.primaryPurple,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppDesignSystem.mdSpacing),
        SizedBox(
          height: 220,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
            itemCount: matches.length > 5 ? 5 : matches.length,
            itemBuilder: (context, index) {
              final match = matches[index];
              return Padding(
                padding: const EdgeInsets.only(right: AppDesignSystem.mdSpacing),
                child: _buildUpcomingMatchCard(match),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildUpcomingMatchCard(dynamic match) {
    return Container(
      width: 320,
      height: 200,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppDesignSystem.getCardBackground(context),
            AppDesignSystem.getSecondaryCard(context),
          ],
        ),
        borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
        border: Border.all(
          color: AppDesignSystem.primaryPurple.withValues(alpha: 0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: AppDesignSystem.primaryPurple.withValues(alpha: 0.3),
            blurRadius: 15,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
            // Header with date
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  match['date'] ?? 'Aug 10',
                  style: TextStyle(
                    color: AppDesignSystem.getSecondaryText(context),
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.green.withValues(alpha: 0.25),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: Colors.green,
                      width: 1.5,
                    ),
                  ),
                  child: const Text(
                    'UPCOMING',
                    style: TextStyle(
                      color: Colors.green,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            // Teams row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Team 1
                Expanded(
                  child: Column(
                    children: [
                      Container(
                        width: 55,
                        height: 55,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppDesignSystem.getCardBackground(context),
                          border: Border.all(
                            color: AppDesignSystem.gold.withValues(alpha: 0.6),
                            width: 2,
                          ),
                        ),
                        child: ClipOval(
                          child: match['team1Logo'] != null && match['team1Logo'].isNotEmpty
                              ? Image.asset(
                                  match['team1Logo'],
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Icon(Icons.sports_kabaddi, color: AppDesignSystem.getPrimaryText(context), size: 30);
                                  },
                                )
                              : Icon(Icons.sports_kabaddi, color: AppDesignSystem.getPrimaryText(context), size: 30),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        match['team1'],
                        style: TextStyle(
                          color: AppDesignSystem.getPrimaryText(context),
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                // VS
                Text(
                  'VS',
                  style: TextStyle(
                    color: AppDesignSystem.getSecondaryText(context),
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                  ),
                ),
                // Team 2
                Expanded(
                  child: Column(
                    children: [
                      Container(
                        width: 55,
                        height: 55,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppDesignSystem.getCardBackground(context),
                          border: Border.all(
                            color: AppDesignSystem.gold.withValues(alpha: 0.6),
                            width: 2,
                          ),
                        ),
                        child: ClipOval(
                          child: match['team2Logo'] != null && match['team2Logo'].isNotEmpty
                              ? Image.asset(
                                  match['team2Logo'],
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Icon(Icons.sports_kabaddi, color: AppDesignSystem.getPrimaryText(context), size: 30);
                                  },
                                )
                              : Icon(Icons.sports_kabaddi, color: AppDesignSystem.getPrimaryText(context), size: 18),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        match['team2'],
                        style: TextStyle(
                          color: AppDesignSystem.getPrimaryText(context),
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            // Venue
            Row(
              children: [
                Icon(
                  Icons.location_on,
                  color: AppDesignSystem.getSecondaryText(context),
                  size: 16,
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    match['venue'] ?? 'Stadium',
                    style: TextStyle(
                      color: AppDesignSystem.getSecondaryText(context),
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPointsTable(List<dynamic> pointsTable) {
    // Use data from admin panel, fallback to real teams if empty
    final displayPointsTable = pointsTable.isEmpty 
        ? AppConstants.allTeams.asMap().entries.map((entry) {
            final index = entry.key;
            final teamName = entry.value;
            return {
              'position': index + 1,
              'teamName': teamName,
              'teamLogo': AppConstants.teamLogos[teamName] ?? '',
              'played': 0,
              'won': 0,
              'lost': 0,
              'points': 0,
              'nrr': '0.00',
            };
          }).toList()
        : pointsTable;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              AppDesignSystem.getCardBackground(context),
              AppDesignSystem.getSecondaryCard(context),
            ],
          ),
          borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
          border: Border.all(
            color: AppDesignSystem.primaryPurple.withValues(alpha: 0.4),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: AppDesignSystem.primaryPurple.withValues(alpha: 0.3),
              blurRadius: 15,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(AppDesignSystem.mdSpacing),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Points Table',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppDesignSystem.getPrimaryText(context),
                      letterSpacing: 0.5,
                    ),
                  ),
                  TextButton(
                    onPressed: () => Navigator.pushNamed(context, '/points-table'),
                    child: Text(
                      'View All',
                      style: TextStyle(
                        color: AppDesignSystem.primaryPurple,
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Table with horizontal scroll for responsive layout
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: SizedBox(
                width: 380, // Fixed width to ensure proper spacing
                child: Column(
                  children: [
                    // Table Header
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing, vertical: AppDesignSystem.smSpacing),
                      decoration: BoxDecoration(
                        color: AppDesignSystem.primaryPurple.withValues(alpha: 0.15),
                        border: Border(
                          bottom: BorderSide(
                            color: AppDesignSystem.divider,
                            width: 1,
                          ),
                        ),
                      ),
                      child: Row(
                        children: [
                          _buildTableHeader('#', 30),
                          _buildTableHeader('Team', 100),
                          _buildTableHeader('P', 30),
                          _buildTableHeader('W', 30),
                          _buildTableHeader('L', 30),
                          _buildTableHeader('PTS', 35),
                          _buildTableHeader('NRR', 50),
                        ],
                      ),
                    ),
                    // Table Rows
                    ...displayPointsTable.map((team) => _buildPointsTableRow(team)).toList(),
                  ],
                ),
              ),
            ),
            const SizedBox(height: AppDesignSystem.smSpacing),
          ],
        ),
      ),
    );
  }

  Widget _buildTableHeader(String text, double width) {
    return SizedBox(
      width: width,
      child: Text(
        text,
        style: const TextStyle(
          color: AppDesignSystem.secondaryText,
          fontSize: 11,
          fontWeight: FontWeight.bold,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }

  Widget _buildPointsTableRow(dynamic team) {
    return InkWell(
      onTap: () => _showTeamBottomSheet(team),
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppDesignSystem.mdSpacing,
          vertical: AppDesignSystem.smSpacing,
        ),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: AppDesignSystem.divider,
              width: 1,
            ),
          ),
        ),
        child: Row(
          children: [
            // Rank
            SizedBox(
              width: 30,
              child: Text(
                '#${team['position'] ?? 1}',
                style: TextStyle(
                  color: AppDesignSystem.getPrimaryText(context),
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            // Team Info (Logo + Name)
            SizedBox(
              width: 100,
              child: Row(
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppDesignSystem.cardBackground,
                      border: Border.all(
                        color: AppDesignSystem.gold.withValues(alpha: 0.5),
                        width: 1,
                      ),
                    ),
                    child: ClipOval(
                      child: team['teamLogo'] != null && team['teamLogo'].isNotEmpty
                          ? Image.asset(
                              team['teamLogo'],
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return Icon(Icons.sports_kabaddi, color: AppDesignSystem.getPrimaryText(context), size: 12);
                              },
                            )
                          : Icon(Icons.sports_kabaddi, color: AppDesignSystem.getPrimaryText(context), size: 12),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      team['teamName'] ?? 'Team',
                      style: TextStyle(
                        color: AppDesignSystem.getPrimaryText(context),
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
            // Stats
            SizedBox(
              width: 30,
              child: Text(
                (team['played'] ?? 0).toString(),
                style: TextStyle(
                  color: AppDesignSystem.getPrimaryText(context),
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            SizedBox(
              width: 30,
              child: Text(
                (team['won'] ?? 0).toString(),
                style: TextStyle(
                  color: AppDesignSystem.getPrimaryText(context),
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            SizedBox(
              width: 30,
              child: Text(
                (team['lost'] ?? 0).toString(),
                style: TextStyle(
                  color: AppDesignSystem.getPrimaryText(context),
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            SizedBox(
              width: 35,
              child: Text(
                (team['points'] ?? 0).toString(),
                style: const TextStyle(
                  color: AppDesignSystem.gold,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            SizedBox(
              width: 50,
              child: Text(
                team['nrr']?.toString() ?? '0.00',
                style: TextStyle(
                  color: AppDesignSystem.getPrimaryText(context),
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopVideos(List<dynamic> videos) {
    // Convert Video entities to the format expected by _buildVideoCard
    final displayVideos = videos;

    if (displayVideos.isEmpty) {
      return const SizedBox.shrink(); // Don't show videos section if no data
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Top Videos',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppDesignSystem.getPrimaryText(context),
                  letterSpacing: 0.5,
                ),
              ),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, '/ott'),
                child: Text(
                  'View All',
                  style: TextStyle(
                    color: AppDesignSystem.primaryPurple,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppDesignSystem.mdSpacing),
        SizedBox(
          height: 270,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
            itemCount: displayVideos.length > 5 ? 5 : displayVideos.length,
            itemBuilder: (context, index) {
              final video = displayVideos[index];
              return Padding(
                padding: const EdgeInsets.only(right: AppDesignSystem.mdSpacing),
                child: _buildVideoCard(video),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildVideoCard(dynamic video) {
    // Handle both Map format and Video entity format
    final videoUrl = video is Map ? video['videoUrl'] : video.videoUrl;
    final title = video is Map ? video['title'] : video.title;
    final thumbnailUrl = video is Map ? video['thumbnailUrl'] : video.thumbnailUrl;
    final category = video is Map ? video['category'] : video.category;
    final duration = video is Map ? video['durationFormatted'] ?? video['duration'] : video.durationFormatted;

    return GestureDetector(
      onTap: () {
        if (videoUrl != null && videoUrl.isNotEmpty) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => VideoPlayerScreen(
                videoUrl: videoUrl,
                title: title ?? 'Video',
              ),
            ),
          );
        }
      },
      child: Container(
        width: 280,
        height: 180,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              AppDesignSystem.getCardBackground(context),
              AppDesignSystem.getSecondaryCard(context),
            ],
          ),
          borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
          border: Border.all(
            color: AppDesignSystem.primaryPurple.withValues(alpha: 0.4),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: AppDesignSystem.primaryPurple.withValues(alpha: 0.3),
              blurRadius: 15,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
          child: Stack(
            fit: StackFit.expand,
            children: [
              thumbnailUrl != null && thumbnailUrl.isNotEmpty
                  ? Image.network(
                      thumbnailUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          color: AppDesignSystem.getCardBackground(context),
                          child: Icon(
                            Icons.play_circle,
                            size: 50,
                            color: AppDesignSystem.getSecondaryText(context),
                          ),
                        );
                      },
                      loadingBuilder: (context, child, loadingProgress) {
                        if (loadingProgress == null) return child;
                        return Container(
                          color: AppDesignSystem.getCardBackground(context),
                          child: Center(
                            child: CircularProgressIndicator(
                              value: loadingProgress.expectedTotalBytes != null
                                  ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
                                  : null,
                              color: AppDesignSystem.primaryPurple,
                            ),
                          ),
                        );
                      },
                    )
                  : Container(
                      color: AppDesignSystem.getCardBackground(context),
                      child: Icon(
                        Icons.play_circle,
                        size: 50,
                        color: AppDesignSystem.getSecondaryText(context),
                      ),
                    ),
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.transparent,
                          Colors.black.withValues(alpha: 0.6),
                        ],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                  ),
                ),
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.8),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      duration ?? '00:00',
                      style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
                Positioned(
                  bottom: 8,
                  left: 8,
                  child: Icon(
                    Icons.play_circle,
                    color: Colors.white.withValues(alpha: 0.9),
                    size: 32,
                  ),
                ),
              // Title and category overlay
              Positioned(
                bottom: 8,
                right: 8,
                left: 60,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      title ?? 'Video',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        shadows: [
                          Shadow(
                            color: Colors.black.withValues(alpha: 0.8),
                            blurRadius: 4,
                          ),
                        ],
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      category ?? 'Highlights',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.9),
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        shadows: [
                          Shadow(
                            color: Colors.black.withValues(alpha: 0.8),
                            blurRadius: 4,
                          ),
                        ],
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFanClubBanner() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
      child: Container(
        height: 200,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
          boxShadow: [
            BoxShadow(
              color: AppDesignSystem.primaryPurple.withValues(alpha: 0.5),
              blurRadius: 25,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
          child: Stack(
            children: [
              // Banner Image
              Image.asset(
                'assets/fan_club_banner.png',
                fit: BoxFit.cover,
                width: double.infinity,
                height: double.infinity,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          AppDesignSystem.primaryPurple,
                          AppDesignSystem.gradientPurple,
                          AppDesignSystem.darkPurple,
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
                    ),
                  );
                },
              ),
              // Subtle gradient overlay for better text readability on left side
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Theme.of(context).brightness == Brightness.dark
                            ? Colors.black.withValues(alpha: 0.7)
                            : Colors.black.withValues(alpha: 0.3),
                        Theme.of(context).brightness == Brightness.dark
                            ? Colors.black.withValues(alpha: 0.3)
                            : Colors.black.withValues(alpha: 0.1),
                        Colors.transparent,
                      ],
                      begin: Alignment.centerLeft,
                      end: Alignment.centerRight,
                      stops: const [0.0, 0.4, 1.0],
                    ),
                  ),
                ),
              ),
              // Premium Fan Club Content - Left Side
              Positioned(
                left: 16,
                top: 16,
                bottom: 16,
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Small badge at top
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppDesignSystem.primaryPurple.withValues(alpha: 0.8),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(
                            color: AppDesignSystem.gold.withValues(alpha: 0.5),
                            width: 1,
                          ),
                        ),
                        child: Text(
                          'IWKL OFFICIAL',
                          style: TextStyle(
                            color: AppDesignSystem.getPrimaryText(context),
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.5,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      // Main heading
                      Text(
                        'JOIN THE\nIWKL FAN CLUB',
                        style: TextStyle(
                          color: AppDesignSystem.getPrimaryText(context),
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1,
                          height: 1.2,
                          shadows: [
                            Shadow(
                              color: Colors.black45,
                              blurRadius: 8,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 8),
                      // Supporting text
                      Text(
                        'Support your favourite team.',
                        style: TextStyle(
                          color: AppDesignSystem.getPrimaryText(context).withValues(alpha: 0.7),
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                          height: 1.3,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Get closer to the action.',
                        style: TextStyle(
                          color: AppDesignSystem.getPrimaryText(context).withValues(alpha: 0.7),
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                          height: 1.3,
                        ),
                      ),
                      const SizedBox(height: 10),
                      // Premium highlight badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              AppDesignSystem.gold.withValues(alpha: 0.2),
                              AppDesignSystem.primaryPurple.withValues(alpha: 0.3),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(
                            color: AppDesignSystem.gold.withValues(alpha: 0.4),
                            width: 1,
                          ),
                        ),
                        child: const Text(
                          '2026 SEASON • OFFICIAL FAN CLUB',
                          style: TextStyle(
                            color: AppDesignSystem.gold,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      // Premium CTA Button
                      Container(
                        width: 140,
                        height: 44,
                        decoration: BoxDecoration(
                          gradient: AppDesignSystem.goldGradient,
                          borderRadius: BorderRadius.circular(22),
                          boxShadow: [
                            BoxShadow(
                              color: AppDesignSystem.gold.withValues(alpha: 0.6),
                              blurRadius: 20,
                              offset: const Offset(0, 4),
                            ),
                            BoxShadow(
                              color: AppDesignSystem.primaryPurple.withValues(alpha: 0.3),
                              blurRadius: 15,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: () {
                              Navigator.pushNamed(context, '/fan-club-registration');
                            },
                            borderRadius: BorderRadius.circular(22),
                            child: const Center(
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    'JOIN NOW',
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 1,
                                    ),
                                  ),
                                  SizedBox(width: 4),
                                  Icon(
                                    Icons.arrow_forward,
                                    color: Colors.black,
                                    size: 16,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLatestNews(List<dynamic> news) {
    // Use data from admin panel, fallback to generated news if empty
    final displayNews = news.isEmpty 
        ? List.generate(5, (index) => {
            'title': 'News ${index + 1}',
            'imageUrl': '',
            'category': 'Latest',
            'date': 'Aug ${10 + index}',
            'time': '2h ago',
          })
        : news;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Latest News',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppDesignSystem.getPrimaryText(context),
                  letterSpacing: 0.5,
                ),
              ),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, '/news'),
                child: Text(
                  'View All',
                  style: TextStyle(
                    color: AppDesignSystem.primaryPurple,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppDesignSystem.mdSpacing),
        SizedBox(
          height: 220,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
            itemCount: displayNews.length > 5 ? 5 : displayNews.length,
            itemBuilder: (context, index) {
              final newsItem = displayNews[index];
              return Padding(
                padding: const EdgeInsets.only(right: AppDesignSystem.mdSpacing),
                child: _buildNewsCard(newsItem),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildNewsCard(dynamic newsItem) {
    return Container(
      width: 260,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppDesignSystem.cardBackground,
            AppDesignSystem.secondaryCard,
          ],
        ),
        borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
        border: Border.all(
          color: AppDesignSystem.primaryPurple.withValues(alpha: 0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: AppDesignSystem.primaryPurple.withValues(alpha: 0.3),
            blurRadius: 15,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(AppDesignSystem.lgRadius),
            ),
            child: Stack(
              children: [
                Container(
                  height: 120,
                  color: AppDesignSystem.cardBackground,
                  child: const Icon(
                    Icons.article,
                    size: 50,
                    color: AppDesignSystem.secondaryText,
                  ),
                ),
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppDesignSystem.primaryPurple.withValues(alpha: 0.9),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      newsItem['category'] ?? 'NEWS',
                      style: TextStyle(
                        color: AppDesignSystem.getPrimaryText(context),
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                Positioned(
                  bottom: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.8),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      newsItem['time'] ?? '2h ago',
                      style: TextStyle(
                        color: AppDesignSystem.getPrimaryText(context),
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(AppDesignSystem.mdSpacing),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  newsItem['title'],
                  style: TextStyle(
                    color: AppDesignSystem.getPrimaryText(context),
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                Text(
                  newsItem['date'],
                  style: TextStyle(
                    color: AppDesignSystem.getSecondaryText(context),
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGalleryPreview() {
    final galleryImages = [
      'assets/gallery/gallery_1.png',
      'assets/gallery/gallery_2.png',
      'assets/gallery/gallery_3.jpg',
    ];
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Gallery',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppDesignSystem.getPrimaryText(context),
                  letterSpacing: 0.5,
                ),
              ),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, '/gallery'),
                child: Text(
                  'View All',
                  style: TextStyle(
                    color: AppDesignSystem.primaryPurple,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppDesignSystem.mdSpacing),
        SizedBox(
          height: 300,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
            itemCount: galleryImages.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(right: AppDesignSystem.mdSpacing),
                child: _buildGalleryPhoto(index, galleryImages),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildGalleryPhoto(int index, List<String> galleryImages) {
    
    return Container(
      width: 300,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
        border: Border.all(
          color: AppDesignSystem.primaryPurple.withValues(alpha: 0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: AppDesignSystem.primaryPurple.withValues(alpha: 0.3),
            blurRadius: 15,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
        child: index < galleryImages.length
            ? Image.asset(
                galleryImages[index],
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          AppDesignSystem.cardBackground,
                          AppDesignSystem.secondaryCard,
                        ],
                      ),
                      borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.photo_library,
                            size: 48,
                            color: AppDesignSystem.primaryPurple,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Photo ${index + 1}',
                            style: TextStyle(
                              color: AppDesignSystem.getPrimaryText(context),
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              )
            : Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppDesignSystem.cardBackground,
                      AppDesignSystem.secondaryCard,
                    ],
                  ),
                  borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
                ),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.photo_library,
                        size: 48,
                        color: AppDesignSystem.primaryPurple,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Photo ${index + 1}',
                        style: TextStyle(
                          color: AppDesignSystem.getPrimaryText(context),
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
      ),
    );
  }

  Widget _buildOTTSection(List<dynamic> videos) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
          child: Text(
            'OTT',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppDesignSystem.getPrimaryText(context),
              letterSpacing: 0.5,
            ),
          ),
        ),
        const SizedBox(height: AppDesignSystem.mdSpacing),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
          child: _buildFeaturedContent(videos.isNotEmpty ? videos.first : null),
        ),
        const SizedBox(height: AppDesignSystem.mdSpacing),
        _buildOTTCategories(),
      ],
    );
  }

  Widget _buildFeaturedContent(dynamic video) {
    // Handle both Map format and Video entity format
    if (video == null) {
      return _buildEmptyFeaturedContent();
    }

    final thumbnailUrl = video is Map ? video['thumbnailUrl'] : video.thumbnailUrl;
    final title = video is Map ? video['title'] : video.title;

    return Container(
      height: 200,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppDesignSystem.cardBackground,
            AppDesignSystem.secondaryCard,
          ],
        ),
        borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
        border: Border.all(
          color: AppDesignSystem.primaryPurple.withValues(alpha: 0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: AppDesignSystem.primaryPurple.withValues(alpha: 0.3),
            blurRadius: 15,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned.fill(
            child: Image.network(
              thumbnailUrl ?? '',
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  color: AppDesignSystem.cardBackground,
                  child: const Icon(
                    Icons.play_circle,
                    size: 70,
                    color: AppDesignSystem.secondaryText,
                  ),
                );
              },
            ),
          ),
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.transparent,
                    AppDesignSystem.primaryBackground.withValues(alpha: 0.95),
                  ],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
              ),
            ),
          ),
          Positioned(
            bottom: AppDesignSystem.mdSpacing,
            left: AppDesignSystem.mdSpacing,
            right: AppDesignSystem.mdSpacing,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    gradient: AppDesignSystem.goldGradient,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'FEATURED',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  title,
                  style: TextStyle(
                    color: AppDesignSystem.getPrimaryText(context),
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Icon(
                      Icons.play_circle,
                      color: AppDesignSystem.primaryPurple,
                      size: 20,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'Watch Now',
                      style: TextStyle(
                        color: AppDesignSystem.primaryPurple,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyFeaturedContent() {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppDesignSystem.cardBackground,
            AppDesignSystem.secondaryCard,
          ],
        ),
        borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
        border: Border.all(
          color: AppDesignSystem.primaryPurple.withValues(alpha: 0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: AppDesignSystem.primaryPurple.withValues(alpha: 0.3),
            blurRadius: 15,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.play_circle,
              size: 70,
              color: AppDesignSystem.secondaryText,
            ),
            const SizedBox(height: 10),
            Text(
              'No Featured Content',
              style: TextStyle(
                color: AppDesignSystem.getPrimaryText(context),
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOTTCategories() {
    final categories = [
      {'icon': Icons.live_tv, 'label': 'Featured Live', 'route': '/live-match'},
      {'icon': Icons.flash_on, 'label': 'Highlights', 'route': '/ott'},
      {'icon': Icons.replay, 'label': 'Replay', 'route': '/ott'},
      {'icon': Icons.play_circle, 'label': 'Continue Watching', 'route': '/ott'},
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
      child: Row(
        children: categories.map((category) {
          return Expanded(
            child: GestureDetector(
              onTap: () {
                Navigator.pushNamed(context, category['route'] as String);
              },
              child: Container(
                margin: const EdgeInsets.only(right: AppDesignSystem.smSpacing),
                padding: const EdgeInsets.symmetric(vertical: AppDesignSystem.mdSpacing),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppDesignSystem.cardBackground,
                      AppDesignSystem.secondaryCard,
                    ],
                  ),
                  borderRadius: BorderRadius.circular(AppDesignSystem.mdRadius),
                  border: Border.all(
                    color: AppDesignSystem.primaryPurple.withValues(alpha: 0.4),
                    width: 1.5,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppDesignSystem.primaryPurple.withValues(alpha: 0.2),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Icon(
                      category['icon'] as IconData,
                      color: AppDesignSystem.primaryPurple,
                      size: 26,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      category['label'] as String,
                      style: TextStyle(
                        color: AppDesignSystem.getPrimaryText(context),
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  void _openStoryViewer(List<dynamic> stories, int initialIndex) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => _StoryViewerScreen(
          stories: stories,
          initialIndex: initialIndex,
        ),
      ),
    );
  }

  void _showTeamBottomSheet(dynamic team) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              AppDesignSystem.cardBackground,
              AppDesignSystem.primaryBackground,
            ],
          ),
          borderRadius: const BorderRadius.vertical(
            top: Radius.circular(24),
          ),
        ),
        child: DraggableScrollableSheet(
          initialChildSize: 0.75,
          minChildSize: 0.5,
          maxChildSize: 0.95,
          builder: (context, scrollController) {
            return Column(
              children: [
                Container(
                  margin: const EdgeInsets.symmetric(vertical: 12),
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppDesignSystem.divider,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
                  child: Column(
                    children: [
                      Container(
                        width: 90,
                        height: 90,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppDesignSystem.cardBackground,
                          border: Border.all(
                            color: AppDesignSystem.gold.withValues(alpha: 0.7),
                            width: 3,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppDesignSystem.primaryPurple.withValues(alpha: 0.6),
                              blurRadius: 20,
                            ),
                          ],
                        ),
                        child: ClipOval(
                          child: team['teamLogo'] != null && team['teamLogo'].isNotEmpty
                              ? Image.asset(
                                  team['teamLogo'],
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Icon(
                                      Icons.sports_kabaddi,
                                      color: AppDesignSystem.getPrimaryText(context),
                                      size: 45,
                                    );
                                  },
                                )
                              : Icon(
                                  Icons.sports_kabaddi,
                                  color: AppDesignSystem.getPrimaryText(context),
                                  size: 45,
                                ),
                        ),
                      ),
                      const SizedBox(height: AppDesignSystem.mdSpacing),
                      Text(
                        team['teamName'] ?? 'Team',
                        style: TextStyle(
                          color: AppDesignSystem.getPrimaryText(context),
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          gradient: AppDesignSystem.primaryGradient,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          'Position: #${team['position'] ?? 1}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(height: AppDesignSystem.mdSpacing),
                      Container(
                        padding: const EdgeInsets.all(AppDesignSystem.mdSpacing),
                        decoration: BoxDecoration(
                          color: AppDesignSystem.getCardBackground(context).withValues(alpha: 0.5),
                          borderRadius: BorderRadius.circular(AppDesignSystem.mdRadius),
                          border: Border.all(
                            color: AppDesignSystem.primaryPurple.withValues(alpha: 0.3),
                            width: 1,
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildDetailRow('Played', team['played']?.toString() ?? '0'),
                            _buildDetailRow('Won', team['won']?.toString() ?? '0'),
                            _buildDetailRow('Lost', team['lost']?.toString() ?? '0'),
                            _buildDetailRow('Points', team['points']?.toString() ?? '0'),
                            _buildDetailRow('NRR', team['nrr']?.toString() ?? '0.00'),
                            _buildDetailRow('Coach', 'TBD'),
                            _buildDetailRow('Captain', 'TBD'),
                            _buildDetailRow('Home Ground', 'TBD'),
                            _buildDetailRow('Recent Form', 'WWLWW'),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppDesignSystem.mdSpacing),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.lgSpacing),
                  child: Container(
                    width: double.infinity,
                    height: 52,
                    decoration: BoxDecoration(
                      gradient: AppDesignSystem.primaryGradient,
                      borderRadius: BorderRadius.circular(26),
                      boxShadow: [
                        BoxShadow(
                          color: AppDesignSystem.primaryPurple.withValues(alpha: 0.5),
                          blurRadius: 15,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () {
                          Navigator.pop(context);
                          Navigator.pushNamed(context, '/team-profile', arguments: team['teamName']);
                        },
                        borderRadius: BorderRadius.circular(26),
                        child: Center(
                          child: Text(
                            'VIEW TEAM',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.5,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: AppDesignSystem.mdSpacing),
                Expanded(
                  child: ListView(
                    controller: scrollController,
                    padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.lgSpacing),
                    children: [
                      _buildBottomSheetOption(
                        icon: Icons.people,
                        label: 'Players',
                        onTap: () {
                          Navigator.pop(context);
                          Navigator.pushNamed(context, '/players');
                        },
                      ),
                      _buildBottomSheetOption(
                        icon: Icons.calendar_today,
                        label: 'Fixtures',
                        onTap: () {
                          Navigator.pop(context);
                          Navigator.pushNamed(context, '/schedule');
                        },
                      ),
                      _buildBottomSheetOption(
                        icon: Icons.bar_chart,
                        label: 'Statistics',
                        onTap: () {
                          Navigator.pop(context);
                        },
                      ),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Text(
            '$label: ',
            style: TextStyle(
              color: AppDesignSystem.secondaryText,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              color: AppDesignSystem.getPrimaryText(context),
              fontSize: 13,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomSheetOption({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: AppDesignSystem.mdSpacing),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: AppDesignSystem.divider,
              width: 1,
            ),
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: AppDesignSystem.primaryGradient,
                boxShadow: [
                  BoxShadow(
                    color: AppDesignSystem.primaryPurple.withValues(alpha: 0.4),
                    blurRadius: 10,
                  ),
                ],
              ),
              child: Icon(
                icon,
                color: Colors.white,
                size: 22,
              ),
            ),
            const SizedBox(width: AppDesignSystem.mdSpacing),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Spacer(),
            Icon(
              Icons.chevron_right,
              color: AppDesignSystem.secondaryText,
              size: 28,
            ),
          ],
        ),
      ),
    );
  }
}

class _StoryViewerScreen extends StatefulWidget {
  final List<dynamic> stories;
  final int initialIndex;

  const _StoryViewerScreen({
    required this.stories,
    required this.initialIndex,
  });

  @override
  State<_StoryViewerScreen> createState() => _StoryViewerScreenState();
}

class _StoryViewerScreenState extends State<_StoryViewerScreen> {
  late PageController _pageController;
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: widget.initialIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() => _currentIndex = index);
            },
            itemCount: widget.stories.length,
            itemBuilder: (context, index) {
              final story = widget.stories[index];
              return Container(
                color: Colors.black,
                child: Container(
                  color: AppDesignSystem.cardBackground,
                  child: const Center(
                    child: Icon(
                      Icons.image,
                      size: 80,
                      color: AppDesignSystem.secondaryText,
                    ),
                  ),
                ),
              );
            },
          ),
          Positioned(
            top: 50,
            left: 0,
            right: 0,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
              child: Row(
                children: List.generate(
                  widget.stories.length,
                  (index) => Expanded(
                    child: Container(
                      margin: EdgeInsets.only(right: index < widget.stories.length - 1 ? 4 : 0),
                      height: 3,
                      decoration: BoxDecoration(
                        color: index <= _currentIndex 
                            ? Colors.white 
                            : Colors.white.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          Positioned(
            top: 50,
            right: 16,
            child: IconButton(
              icon: const Icon(Icons.close, color: Colors.white, size: 30),
              onPressed: () => Navigator.pop(context),
            ),
          ),
          Positioned(
            bottom: 50,
            left: 16,
            right: 16,
            child: SafeArea(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.stories[_currentIndex]['title'] ?? 'Story',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
