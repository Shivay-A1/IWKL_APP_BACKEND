import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:iwkl_app/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:iwkl_app/features/auth/presentation/bloc/auth_event.dart';
import 'package:iwkl_app/features/auth/presentation/bloc/auth_state.dart';
import 'package:iwkl_app/features/auth/domain/entities/user.dart';
import 'package:iwkl_app/core/constants/app_constants.dart';
import 'package:iwkl_app/core/widgets/premium_team_standings.dart';
import '../widgets/live_match_card.dart';
import '../widgets/story_bar.dart';
import '../widgets/news_card.dart';
import '../widgets/video_card.dart';
import '../widgets/match_card.dart';
import '../../domain/entities/match.dart';
import '../../domain/entities/news.dart';
import '../../domain/entities/video.dart';
import '../../domain/entities/story.dart';
import '../bloc/home_bloc.dart';
import '../bloc/home_event.dart';
import '../bloc/home_state.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with AutomaticKeepAliveClientMixin {
  final CarouselSliderController _carouselController = CarouselSliderController();
  int _currentCarouselIndex = 0;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    context.read<HomeBloc>().add(LoadHomeData());
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                const Color(0xFF13051E).withOpacity(0.95),
                const Color(0xFF13051E).withOpacity(0.8),
                Colors.transparent,
              ],
            ),
          ),
        ),
        title: Row(
          children: [
            Image.asset(
              'assets/logo/iwkl_logo.png',
              height: 75,
              width: 75,
              errorBuilder: (context, error, stackTrace) {
                return const Icon(Icons.sports_kabaddi, size: 75, color: Colors.white);
              },
            ),
          ],
        ),
        actions: [
          // Search Button
          Container(
            margin: const EdgeInsets.only(right: 6),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withOpacity(0.1),
              border: Border.all(
                color: const Color(0xFF9333EA).withOpacity(0.3),
                width: 1,
              ),
            ),
            child: IconButton(
              iconSize: 20,
              icon: const Icon(Icons.search, color: Colors.white),
              onPressed: () {
                Navigator.pushNamed(context, '/search');
              },
              constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
              padding: const EdgeInsets.all(6),
            ),
          ),
          // Secret Admin Access - Long press on logo (5 seconds)
          GestureDetector(
            onLongPress: () {
              Navigator.pushNamed(context, '/admin-login');
            },
            child: Container(
              margin: const EdgeInsets.only(right: 6),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.1),
                border: Border.all(
                  color: Colors.white.withOpacity(0.1),
                  width: 1,
                ),
              ),
              child: IconButton(
                iconSize: 20,
                icon: const Icon(Icons.admin_panel_settings, color: Colors.white30),
                onPressed: () {
                  // Normal tap does nothing
                },
                constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                padding: const EdgeInsets.all(6),
              ),
            ),
          ),
          // Notification Button
          Container(
            margin: const EdgeInsets.only(right: 6),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withOpacity(0.1),
              border: Border.all(
                color: const Color(0xFF9333EA).withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Stack(
              children: [
                IconButton(
                  iconSize: 20,
                  icon: const Icon(Icons.notifications_outlined, color: Colors.white),
                  onPressed: () {
                    Navigator.pushNamed(context, '/notifications');
                  },
                  constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                  padding: const EdgeInsets.all(6),
                ),
                BlocBuilder<HomeBloc, HomeState>(
                  buildWhen: (previous, current) {
                    // Only rebuild when unread count changes
                    if (previous is HomeLoaded && current is HomeLoaded) {
                      return previous.unreadCount != current.unreadCount;
                    }
                    return true;
                  },
                  builder: (context, state) {
                    if (state is HomeLoaded && state.unreadCount > 0) {
                      return Positioned(
                        right: 4,
                        top: 4,
                        child: Container(
                          padding: const EdgeInsets.all(3),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [
                                Color(0xFF9333EA),
                                Color(0xFFEC4899),
                              ],
                            ),
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF9333EA).withOpacity(0.5),
                                blurRadius: 6,
                                spreadRadius: 1,
                              ),
                            ],
                          ),
                          child: Text(
                            state.unreadCount > 9 ? '9+' : state.unreadCount.toString(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 8,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      );
                    }
                    return const SizedBox.shrink();
                  },
                ),
              ],
            ),
          ),
          // Login Button
          BlocBuilder<AuthBloc, AuthState>(
            buildWhen: (previous, current) => previous.runtimeType != current.runtimeType,
            builder: (context, authState) {
              if (authState is AuthAuthenticated) {
                return const SizedBox.shrink();
              }
              return Container(
                margin: const EdgeInsets.only(right: 12),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFF4C085D),
                      Color(0xFF9333EA),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF4C085D).withOpacity(0.4),
                      blurRadius: 10,
                      spreadRadius: 1,
                    ),
                  ],
                ),
                child: TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/login');
                  },
                  child: const Text(
                    'Login',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
      drawer: _buildDrawer(),
      body: BlocBuilder<HomeBloc, HomeState>(
        buildWhen: (previous, current) => previous.runtimeType != current.runtimeType,
        builder: (context, state) {
          if (state is HomeLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is HomeLoaded) {
            return _buildContent(state);
          } else if (state is HomeError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 64, color: Colors.red),
                  const SizedBox(height: 16),
                  Text(state.message),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      context.read<HomeBloc>().add(LoadHomeData());
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }
          return const SizedBox.shrink();
        },
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  Widget _buildContent(HomeLoaded state) {
    return RefreshIndicator(
      onRefresh: () async {
        context.read<HomeBloc>().add(LoadHomeData());
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Stories - Always show with placeholder if empty
            state.stories.isNotEmpty 
                ? StoryBar(stories: state.stories)
                : _buildPlaceholderStories(),
            const SizedBox(height: 16),

            // Hero Slider - Always show with placeholder if empty
            state.sliders.isNotEmpty 
                ? _buildHeroSlider(state.sliders)
                : _buildPlaceholderHeroSlider(),
            const SizedBox(height: 24),

            // Live Match - Always show with placeholder if empty
            state.liveMatch != null
                ? Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: LiveMatchCard(match: state.liveMatch!),
                  )
                : _buildPlaceholderLiveMatch(),
            const SizedBox(height: 24),

            // Upcoming Matches
            _buildSectionTitle('Upcoming Matches'),
            state.upcomingMatches.isNotEmpty
                ? _buildHorizontalMatches(state.upcomingMatches)
                : _buildPlaceholderMatches(),
            const SizedBox(height: 24),

            // Latest News
            _buildSectionTitle('Latest News'),
            state.news.isNotEmpty
                ? _buildHorizontalNews(state.news)
                : _buildPlaceholderNews(),
            const SizedBox(height: 24),

            // Featured Videos
            _buildSectionTitle('Featured Videos'),
            state.videos.isNotEmpty
                ? _buildHorizontalVideos(state.videos)
                : _buildPlaceholderVideos(),
            const SizedBox(height: 24),

            // Points Table Preview
            _buildSectionTitle('Points Table'),
            _buildPointsTablePreview(state.pointsTable),
            const SizedBox(height: 24),

            // Sponsors
            state.sponsors.isNotEmpty
                ? _buildSponsors(state.sponsors)
                : _buildPlaceholderSponsors(),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroSlider(List<String> sliders) {
    return Column(
      children: [
        CarouselSlider(
          items: sliders.map((slider) {
            return Builder(
              builder: (BuildContext context) {
                return Container(
                  width: MediaQuery.of(context).size.width,
                  margin: const EdgeInsets.symmetric(horizontal: 5.0),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    color: Colors.black,
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF4C085D).withOpacity(0.3),
                        blurRadius: 20,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.network(
                      slider,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          decoration: const BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Color(0xFF4C085D),
                                Color(0xFF9333EA),
                              ],
                            ),
                          ),
                          child: const Center(
                            child: Icon(Icons.error_outline, size: 40, color: Colors.white54),
                          ),
                        );
                      },
                    ),
                  ),
                );
              },
            );
          }).toList(),
          carouselController: _carouselController,
          options: CarouselOptions(
            height: 200,
            viewportFraction: 1.0,
            enlargeCenterPage: false,
            autoPlay: true,
            autoPlayInterval: const Duration(seconds: 5),
            onPageChanged: (index, reason) {
              setState(() {
                _currentCarouselIndex = index;
              });
            },
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            sliders.length,
            (index) => AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 4),
              height: 8,
              width: _currentCarouselIndex == index ? 24 : 8,
              decoration: BoxDecoration(
                color: _currentCarouselIndex == index
                    ? const Color(0xFF9333EA)
                    : Colors.white24,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          TextButton(
            onPressed: () {
              // Navigate to respective full page based on title
              switch (title) {
                case 'Upcoming Matches':
                  Navigator.pushNamed(context, '/schedule');
                  break;
                case 'Latest News':
                  Navigator.pushNamed(context, '/news');
                  break;
                case 'Featured Videos':
                  Navigator.pushNamed(context, '/ott');
                  break;
                case 'Points Table':
                  Navigator.pushNamed(context, '/points-table');
                  break;
                case 'Gallery':
                  Navigator.pushNamed(context, '/gallery');
                  break;
                case 'Teams':
                  Navigator.pushNamed(context, '/teams');
                  break;
                default:
                  break;
              }
            },
            child: const Text('See All'),
          ),
        ],
      ),
    );
  }

  Widget _buildHorizontalMatches(List<Match> matches) {
    return SizedBox(
      height: 160,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: matches.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: MatchCard(match: matches[index]),
          );
        },
      ),
    );
  }

  Widget _buildHorizontalNews(List<News> news) {
    return SizedBox(
      height: 200,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: news.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: NewsCard(news: news[index]),
          );
        },
      ),
    );
  }

  Widget _buildHorizontalVideos(List<Video> videos) {
    return SizedBox(
      height: 180,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: videos.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: VideoCard(video: videos[index]),
          );
        },
      ),
    );
  }

  Widget _buildPointsTablePreview(List<dynamic> pointsTable) {
    // Generate standings from AppConstants teams if pointsTable is empty
    final standings = pointsTable.isEmpty
        ? AppConstants.allTeams.asMap().entries.map((entry) {
            final index = entry.key;
            final teamName = entry.value;
            return TeamStanding(
              rank: index + 1,
              teamName: teamName,
              teamLogo: AppConstants.teamLogos[teamName],
              played: 0,
              won: 0,
              lost: 0,
              drawn: 0,
              points: 0,
              scoreDiff: 0,
            );
          }).toList()
        : pointsTable.asMap().entries.map((entry) {
            final index = entry.key;
            final team = entry.value;
            return TeamStanding(
              rank: index + 1,
              teamName: team['team']?.toString() ?? 'Unknown',
              teamLogo: AppConstants.teamLogos[team['team']?.toString()],
              played: team['played'] as int? ?? 0,
              won: team['won'] as int? ?? 0,
              lost: team['lost'] as int? ?? 0,
              drawn: team['drawn'] as int? ?? 0,
              points: team['points'] as int? ?? 0,
              scoreDiff: team['scoreDiff'] as int? ?? 0,
              raidPoints: team['raidPoints'] as int?,
              tacklePoints: team['tacklePoints'] as int?,
            );
          }).toList();

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'IWKL League Standings',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/teams');
                },
                child: const Text(
                  'View All',
                  style: TextStyle(
                    color: Color(0xFF9333EA),
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        PremiumTeamStandings(
          standings: standings,
          onTeamTap: (standing) {
            // Navigate to team profile
            Navigator.pushNamed(context, '/team-profile', arguments: standing.teamName);
          },
        ),
      ],
    );
  }

  Widget _buildSponsors(List<String> sponsors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Our Sponsors'),
        SizedBox(
          height: 80,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: sponsors.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Container(
                  width: 100,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Image.network(sponsors[index], fit: BoxFit.contain),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildDrawer() {
    return Container(
      width: 280,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            const Color(0xFF13051E).withOpacity(0.98),
            const Color(0xFF4C085D).withOpacity(0.9),
            const Color(0xFF13051E).withOpacity(0.98),
          ],
        ),
      ),
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          // Profile Header - Shows user info or login/signup
          BlocBuilder<AuthBloc, AuthState>(
            builder: (context, authState) {
              if (authState is AuthAuthenticated) {
                return _buildLoggedInProfileHeader(context, authState.user);
              } else {
                return _buildGuestProfileHeader(context);
              }
            },
          ),
          const SizedBox(height: 8),
          _buildDrawerItem(Icons.home, 'Home', () {
            Navigator.pop(context);
          }),
          _buildDrawerItem(Icons.sports_cricket, 'Live Match', () {
            Navigator.pushNamed(context, '/live-match');
          }),
          _buildDrawerItem(Icons.play_circle, 'OTT', () {
            Navigator.pushNamed(context, '/ott');
          }),
          _buildDrawerItem(Icons.groups, 'Teams', () {
            Navigator.pushNamed(context, '/teams');
          }),
          _buildDrawerItem(Icons.person, 'Players', () {
            Navigator.pushNamed(context, '/players');
          }),
          _buildDrawerItem(Icons.calendar_month, 'Schedule', () {
            Navigator.pushNamed(context, '/schedule');
          }),
          _buildDrawerItem(Icons.leaderboard, 'Points Table', () {
            Navigator.pushNamed(context, '/points-table');
          }),
          _buildDrawerItem(Icons.photo_library, 'Gallery', () {
            Navigator.pushNamed(context, '/gallery');
          }),
          _buildDrawerItem(Icons.article, 'News', () {
            Navigator.pushNamed(context, '/news');
          }),
          _buildDrawerItem(Icons.notifications, 'Notifications', () {
            Navigator.pushNamed(context, '/notifications');
          }),
          _buildDrawerItem(Icons.favorite, 'Fan Club', () {
            Navigator.pushNamed(context, '/fan-club');
          }),
          const Divider(
            color: Colors.white10,
            thickness: 1,
            indent: 16,
            endIndent: 16,
          ),
          // Player Registration - Opens popup and redirects to website
          _buildDrawerItem(Icons.person_add, 'Player Registration', () {
            _showPlayerRegistrationPopup(context);
          }),
          _buildDrawerItem(Icons.settings, 'Settings', () {
            Navigator.pushNamed(context, '/settings');
          }),
          _buildDrawerItem(Icons.support_agent, 'Support', () {
            Navigator.pushNamed(context, '/support');
          }),
          _buildDrawerItem(Icons.info, 'About IWKL', () {
            Navigator.pushNamed(context, '/about');
          }),
          const Divider(
            color: Colors.white10,
            thickness: 1,
            indent: 16,
            endIndent: 16,
          ),
          BlocBuilder<AuthBloc, AuthState>(
            builder: (context, authState) {
              if (authState is AuthAuthenticated) {
                return Column(
                  children: [
                    _buildDrawerItem(Icons.logout, 'Logout', () {
                      context.read<AuthBloc>().add(LogoutEvent());
                      Navigator.pop(context);
                    }),
                  ],
                );
              } else {
                return Column(
                  children: [
                    _buildDrawerItem(Icons.login, 'Login', () {
                      Navigator.pushNamed(context, '/login');
                    }),
                    _buildDrawerItem(Icons.app_registration, 'Sign Up', () {
                      Navigator.pushNamed(context, '/register');
                    }),
                  ],
                );
              }
            },
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildDrawerItem(IconData icon, String title, VoidCallback onTap) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.05),
            Colors.white.withOpacity(0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          splashColor: const Color(0xFF9333EA).withOpacity(0.2),
          highlightColor: const Color(0xFF9333EA).withOpacity(0.1),
          child: ListTile(
            leading: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    const Color(0xFF4C085D).withOpacity(0.2),
                    const Color(0xFF9333EA).withOpacity(0.2),
                  ],
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                icon,
                color: const Color(0xFF9333EA),
                size: 20,
              ),
            ),
            title: Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 15,
                fontWeight: FontWeight.w500,
              ),
            ),
            trailing: const Icon(
              Icons.chevron_right,
              color: Colors.white30,
              size: 20,
            ),
          ),
        ),
      ),
    ).animate().fadeIn(duration: 200.ms).slideX(begin: -0.1, end: 0);
  }

  Widget _buildLoggedInProfileHeader(BuildContext context, User user) {
    final hour = DateTime.now().hour;
    String greeting;
    if (hour < 12) {
      greeting = 'Good Morning';
    } else if (hour < 17) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFF4C085D),
            const Color(0xFF9333EA),
            const Color(0xFFEC4899).withOpacity(0.3),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF4C085D).withOpacity(0.3),
            blurRadius: 20,
            spreadRadius: 5,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                greeting,
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 12,
                ),
              ),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withOpacity(0.1),
                ),
                child: const Icon(
                  Icons.notifications_outlined,
                  color: Colors.white,
                  size: 18,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFF4C085D),
                      Color(0xFF9333EA),
                    ],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF9333EA).withOpacity(0.5),
                      blurRadius: 15,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.all(4),
                  child: ClipOval(
                    child: user.avatar != null
                        ? Image.network(
                            user.avatar!,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return const Icon(Icons.person, size: 30, color: Colors.white);
                            },
                          )
                        : const Icon(Icons.person, size: 30, color: Colors.white),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      user.name,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Player ID: IWKL-2026-${user.id.substring(0, 6)}',
                      style: const TextStyle(
                        color: Colors.white60,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF9333EA),
                      const Color(0xFFEC4899),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'Approved',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'Uttar Pradesh',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 10,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGuestProfileHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFF4C085D),
            const Color(0xFF9333EA),
            const Color(0xFFEC4899).withOpacity(0.3),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF4C085D).withOpacity(0.3),
            blurRadius: 20,
            spreadRadius: 5,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Welcome to IWKL',
            style: TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Season 2026',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () => Navigator.pushNamed(context, '/login'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFF4C085D),
                          Color(0xFF9333EA),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text(
                      'Login',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: GestureDetector(
                  onTap: () => Navigator.pushNamed(context, '/register'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: const Color(0xFF9333EA).withOpacity(0.5),
                      ),
                    ),
                    child: const Text(
                      'Signup',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showPlayerRegistrationPopup(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E1E2E),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Column(
          children: [
            Icon(
              Icons.person_add,
              size: 48,
              color: Color(0xFF9333EA),
            ),
            SizedBox(height: 16),
            Text(
              'Player Registration',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 20,
              ),
            ),
          ],
        ),
        content: const Text(
          'You are being redirected to the official IWKL Registration Portal.',
          style: TextStyle(
            color: Colors.white70,
            fontSize: 14,
          ),
          textAlign: TextAlign.center,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Cancel',
              style: TextStyle(
                color: Color(0xFF9333EA),
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              // Open registration website
              final url = Uri.parse('https://iwkl.org/player-registration');
              if (await canLaunchUrl(url)) {
                await launchUrl(url, mode: LaunchMode.externalApplication);
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF9333EA),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text(
              'Continue',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNavigationBar() {
    return Container(
      margin: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(0xFF13051E).withOpacity(0.95),
            const Color(0xFF4C085D).withOpacity(0.8),
          ],
        ),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(
          color: const Color(0xFF9333EA).withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF4C085D).withOpacity(0.3),
            blurRadius: 30,
            spreadRadius: 5,
          ),
          BoxShadow(
            color: const Color(0xFF9333EA).withOpacity(0.2),
            blurRadius: 20,
            spreadRadius: 10,
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(30),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(Icons.home, 'Home', 0, true),
              _buildNavItem(Icons.sports_cricket, 'Matches', 1, false),
              _buildNavItem(Icons.play_circle, 'OTT', 2, false),
              _buildNavItem(Icons.groups, 'Teams', 3, false),
              _buildNavItem(Icons.person, 'Profile', 4, false),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, int index, bool isActive) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          switch (index) {
            case 0:
              // Already on home
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
        borderRadius: BorderRadius.circular(20),
        splashColor: const Color(0xFF9333EA).withOpacity(0.3),
        highlightColor: const Color(0xFF9333EA).withOpacity(0.1),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            gradient: isActive
                ? LinearGradient(
                    colors: [
                      const Color(0xFF4C085D),
                      const Color(0xFF9333EA),
                    ],
                  )
                : null,
            color: isActive ? null : Colors.transparent,
            borderRadius: BorderRadius.circular(20),
            boxShadow: isActive
                ? [
                    BoxShadow(
                      color: const Color(0xFF4C085D).withOpacity(0.5),
                      blurRadius: 15,
                      spreadRadius: 2,
                    ),
                  ]
                : null,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                color: isActive ? Colors.white : Colors.white70,
                size: 20,
              ),
              if (isActive) ...[
                const SizedBox(width: 8),
                Text(
                  label,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ],
          ),
        ),
      ).animate().fadeIn(duration: 300.ms),
    );
  }

  // Placeholder UI Components
  Widget _buildPlaceholderStories() {
    return SizedBox(
      height: 110,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: 5,
        itemBuilder: (context, index) {
          return Container(
            width: 75,
            margin: const EdgeInsets.only(right: 12),
            child: Column(
              children: [
                Container(
                  width: 70,
                  height: 70,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: [
                        const Color(0xFF4C085D),
                        const Color(0xFF6F1AB6),
                      ],
                    ),
                    border: Border.all(
                      color: const Color(0xFF9333EA),
                      width: 3,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF4C085D).withOpacity(0.4),
                        blurRadius: 15,
                        spreadRadius: 2,
                      ),
                      BoxShadow(
                        color: const Color(0xFF9333EA).withOpacity(0.3),
                        blurRadius: 20,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(Icons.add_circle_outline, color: Colors.white70, size: 32),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  index == 0 ? 'You' : 'Team ${index + 1}',
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms, delay: (index * 100).ms).scale();
        },
      ),
    );
  }

  Widget _buildPlaceholderHeroSlider() {
    return Container(
      height: 220,
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF4C085D).withOpacity(0.3),
            blurRadius: 30,
            spreadRadius: 5,
          ),
          BoxShadow(
            color: const Color(0xFF9333EA).withOpacity(0.5),
            blurRadius: 20,
            spreadRadius: 10,
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Hero Banner Image
            Image.asset(
              'assets/banners/hero_banner_premium.png',
              fit: BoxFit.contain,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Color(0xFF4C085D),
                        Color(0xFF9333EA),
                        Color(0xFFEC4899),
                      ],
                    ),
                  ),
                  child: const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.sports_kabaddi, size: 60, color: Colors.white70),
                        SizedBox(height: 16),
                        Text(
                          'IWKL Season 2026',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Coming Soon',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.white70,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            // Glass Overlay
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.transparent,
                    const Color(0xFF13051E).withOpacity(0.7),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.2, end: 0);
  }

  Widget _buildPlaceholderLiveMatch() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          colors: [
            const Color(0xFF4C085D),
            const Color(0xFF6F1AB6),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF9333EA).withOpacity(0.3),
            blurRadius: 30,
            spreadRadius: 5,
          ),
          BoxShadow(
            color: const Color(0xFF9333EA).withOpacity(0.2),
            blurRadius: 20,
            spreadRadius: 10,
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          children: [
            // Background Pattern
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    const Color(0xFF4C085D).withOpacity(0.9),
                    const Color(0xFF6F1AB6).withOpacity(0.7),
                  ],
                ),
              ),
            ),
            // Content
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  // Live Badge
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [
                              Color(0xFFEC4899),
                              Color(0xFF9333EA),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(25),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFEC4899).withOpacity(0.5),
                              blurRadius: 15,
                              spreadRadius: 2,
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                              ),
                            ).animate().scale(duration: 800.ms, curve: Curves.easeInOut).then().scale(duration: 800.ms, curve: Curves.easeInOut),
                            const SizedBox(width: 8),
                            const Text(
                              'LIVE',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                                letterSpacing: 2,
                              ),
                            ),
                          ],
                        ),
                      ).animate().shimmer(duration: 2000.ms),
                    ],
                  ),
                  const SizedBox(height: 25),
                  // Teams and Score
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      // Team 1
                      Column(
                        children: [
                          Container(
                            width: 60,
                            height: 60,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(
                                colors: [
                                  const Color(0xFF9333EA).withOpacity(0.3),
                                  const Color(0xFF9333EA).withOpacity(0.3),
                                ],
                              ),
                              border: Border.all(
                                color: const Color(0xFF9333EA).withOpacity(0.5),
                                width: 2,
                              ),
                            ),
                            child: const Icon(Icons.sports_cricket, size: 35, color: Colors.white70),
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'Team 1',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      // Score
                      Column(
                        children: [
                          const Text(
                            '0 - 0',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 42,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 4,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(15),
                            ),
                            child: const Text(
                              'No Live Match',
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                      // Team 2
                      Column(
                        children: [
                          Container(
                            width: 60,
                            height: 60,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(
                                colors: [
                                  const Color(0xFF9333EA).withOpacity(0.3),
                                  const Color(0xFF9333EA).withOpacity(0.3),
                                ],
                              ),
                              border: Border.all(
                                color: const Color(0xFF9333EA).withOpacity(0.5),
                                width: 2,
                              ),
                            ),
                            child: const Icon(Icons.sports_cricket, size: 35, color: Colors.white70),
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'Team 2',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  // Watch Live Button
                  Container(
                    width: double.infinity,
                    height: 50,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFF9333EA),
                          Color(0xFFEC4899),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(25),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF9333EA).withOpacity(0.5),
                          blurRadius: 20,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.play_arrow, color: Color(0xFF13051E)),
                          SizedBox(width: 8),
                          Text(
                            'Watch Live',
                            style: TextStyle(
                              color: Color(0xFF13051E),
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(duration: 600.ms, delay: 200.ms).scale();
  }

  Widget _buildPlaceholderMatches() {
    return Container(
      height: 180,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: 3,
        itemBuilder: (context, index) {
          return Container(
            width: 280,
            margin: const EdgeInsets.only(right: 12),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  const Color(0xFF2D1B4E),
                  const Color(0xFF4C085D).withOpacity(0.5),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: const Color(0xFF9333EA).withOpacity(0.4),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF4C085D).withOpacity(0.2),
                  blurRadius: 15,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Date Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFF9333EA),
                          Color(0xFFEC4899),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Text(
                      'Tomorrow',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  // Teams
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        children: [
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(
                                colors: [
                                  const Color(0xFF4C085D).withOpacity(0.3),
                                  const Color(0xFF9333EA).withOpacity(0.3),
                                ],
                              ),
                              border: Border.all(
                                color: const Color(0xFF9333EA).withOpacity(0.4),
                                width: 1.5,
                              ),
                            ),
                            child: const Icon(Icons.sports_cricket, size: 20, color: Colors.white70),
                          ),
                          const SizedBox(height: 3),
                          const Text(
                            'Team 1',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const Text(
                        'VS',
                        style: TextStyle(
                          color: Colors.white54,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Column(
                        children: [
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(
                                colors: [
                                  const Color(0xFF4C085D).withOpacity(0.3),
                                  const Color(0xFF9333EA).withOpacity(0.3),
                                ],
                              ),
                              border: Border.all(
                                color: const Color(0xFF9333EA).withOpacity(0.4),
                                width: 1.5,
                              ),
                            ),
                            child: const Icon(Icons.sports_cricket, size: 20, color: Colors.white70),
                          ),
                          const SizedBox(height: 3),
                          const Text(
                            'Team 2',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  // Countdown
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildCountdownItem('12', 'HRS'),
                      const Text(':', style: TextStyle(color: Colors.white54, fontSize: 16)),
                      _buildCountdownItem('30', 'MIN'),
                      const Text(':', style: TextStyle(color: Colors.white54, fontSize: 16)),
                      _buildCountdownItem('45', 'SEC'),
                    ],
                  ),
                  const SizedBox(height: 8),
                  // Venue
                  Row(
                    children: [
                      const Icon(Icons.location_on, size: 14, color: Color(0xFF9333EA)),
                      const SizedBox(width: 4),
                      const Text(
                        'Mumbai Arena',
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 12,
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF9333EA).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.notifications_active, size: 12, color: Color(0xFF9333EA)),
                            SizedBox(width: 4),
                            Text(
                              'Remind',
                              style: TextStyle(
                                color: Color(0xFF9333EA),
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ).animate().fadeIn(duration: 400.ms, delay: (index * 100).ms).slideX(begin: 0.2, end: 0);
        },
      ),
    );
  }

  Widget _buildCountdownItem(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white54,
            fontSize: 9,
          ),
        ),
      ],
    );
  }

  Widget _buildPlaceholderNews() {
    return SizedBox(
      height: 220,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: 3,
        itemBuilder: (context, index) {
          return Container(
            width: 260,
            margin: const EdgeInsets.only(right: 12),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  const Color(0xFF2D1B4E),
                  const Color(0xFF4C085D).withOpacity(0.4),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: const Color(0xFF9333EA).withOpacity(0.3),
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF9333EA).withOpacity(0.15),
                  blurRadius: 15,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Image Placeholder
                Expanded(
                  flex: 3,
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          const Color(0xFF4C085D).withOpacity(0.5),
                          const Color(0xFF6F1AB6).withOpacity(0.3),
                        ],
                      ),
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(16),
                        topRight: Radius.circular(16),
                      ),
                    ),
                    child: const Center(
                      child: Icon(Icons.article, size: 40, color: Colors.white54),
                    ),
                  ),
                ),
                // Content
                Expanded(
                  flex: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(6),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Category Badge
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [
                                Color(0xFF9333EA),
                                Color(0xFFEC4899),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            'Match',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 8,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(height: 4),
                        // Title
                        const Text(
                          'Latest News Update',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        // Date
                        const Text(
                          '2 hours ago',
                          style: TextStyle(
                            color: Colors.white54,
                            fontSize: 9,
                          ),
                        ),
                        const Spacer(),
                        // Actions
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Icon(Icons.bookmark_border, size: 12, color: Colors.white70),
                            ),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Icon(Icons.share, size: 12, color: Colors.white70),
                            ),
                            const Spacer(),
                            const Text(
                              'Read More',
                              style: TextStyle(
                                color: Color(0xFF9333EA),
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms, delay: (index * 100).ms).slideX(begin: 0.2, end: 0);
        },
      ),
    );
  }

  Widget _buildPlaceholderVideos() {
    return SizedBox(
      height: 200,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: 3,
        itemBuilder: (context, index) {
          return Container(
            width: 240,
            margin: const EdgeInsets.only(right: 12),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  const Color(0xFF2D1B4E),
                  const Color(0xFF4C085D).withOpacity(0.4),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: const Color(0xFF9333EA).withOpacity(0.3),
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF9333EA).withOpacity(0.15),
                  blurRadius: 15,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Video Thumbnail
                Expanded(
                  flex: 3,
                  child: Stack(
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              const Color(0xFF4C085D).withOpacity(0.5),
                              const Color(0xFF6F1AB6).withOpacity(0.3),
                            ],
                          ),
                          borderRadius: const BorderRadius.only(
                            topLeft: Radius.circular(16),
                            topRight: Radius.circular(16),
                          ),
                        ),
                        child: const Center(
                          child: Icon(Icons.play_circle_outline, size: 50, color: Colors.white54),
                        ),
                      ),
                      // Duration Badge
                      Positioned(
                        bottom: 8,
                        right: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.7),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            '12:34',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      // Premium Badge
                      Positioned(
                        top: 8,
                        left: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [
                                Color(0xFF9333EA),
                                Color(0xFFEC4899),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            'PREMIUM',
                            style: TextStyle(
                              color: Color(0xFF13051E),
                              fontSize: 8,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                // Content
                Expanded(
                  flex: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Category
                        const Text(
                          'Highlights',
                          style: TextStyle(
                            color: Color(0xFF9333EA),
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        // Title
                        const Text(
                          'Match Highlights',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 3),
                        // Views
                        Row(
                          children: [
                            const Icon(Icons.visibility, size: 11, color: Colors.white54),
                            const SizedBox(width: 3),
                            const Text(
                              '12.5K views',
                              style: TextStyle(
                                color: Colors.white54,
                                fontSize: 9,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms, delay: (index * 100).ms).scale();
        },
      ),
    );
  }

  Widget _buildPlaceholderSponsors() {
    return Container(
      height: 80,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: 4,
        itemBuilder: (context, index) {
          return Container(
            width: 100,
            margin: const EdgeInsets.only(right: 12),
            decoration: BoxDecoration(
              color: Colors.white10,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.white.withOpacity(0.2)),
            ),
            child: const Center(
              child: Icon(Icons.business, size: 30, color: Colors.white30),
            ),
          ).animate().fadeIn(duration: 400.ms, delay: (index * 100).ms);
        },
      ),
    );
  }
}
