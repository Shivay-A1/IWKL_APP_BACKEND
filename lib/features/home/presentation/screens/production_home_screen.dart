import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'dart:ui';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/widgets/glass_card.dart';

class ProductionHomeScreen extends StatefulWidget {
  const ProductionHomeScreen({super.key});

  @override
  State<ProductionHomeScreen> createState() => _ProductionHomeScreenState();
}

class _ProductionHomeScreenState extends State<ProductionHomeScreen> {
  int _currentIndex = 0;
  int _notificationCount = 3;
  int _bannerIndex = 0;
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(AppConstants.backgroundColorValue),
      body: CustomScrollView(
        controller: _scrollController,
        slivers: [
          // Premium AppBar
          SliverAppBar(
            floating: true,
            pinned: true,
            backgroundColor: Colors.transparent,
            elevation: 0,
            flexibleSpace: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    const Color(AppConstants.primaryColorValue).withOpacity(0.9),
                    const Color(AppConstants.primaryColorValue).withOpacity(0.0),
                  ],
                ),
              ),
            ),
            title: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset(
                  'assets/logo/iwkl_logo.png',
                  height: 45,
                  errorBuilder: (context, error, stackTrace) {
                    return const Icon(Icons.sports_kabaddi, size: 45, color: Color(AppConstants.accentColorValue));
                  },
                ),
              ],
            ),
            leading: IconButton(
              icon: const Icon(Icons.menu, color: Colors.white),
              onPressed: () => Scaffold.of(context).openDrawer(),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.search, color: Colors.white),
                onPressed: () {},
              ),
              Stack(
                children: [
                  IconButton(
                    icon: const Icon(Icons.notifications_outlined, color: Colors.white),
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

          // Content
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Hero Banner
                _buildHeroBanner(),
                const SizedBox(height: 24),

                // Live Match
                _buildLiveMatch(),
                const SizedBox(height: 24),

                // Upcoming Matches
                _buildUpcomingMatches(),
                const SizedBox(height: 24),

                // Top Raiders & Defenders
                _buildTopPlayers(),
                const SizedBox(height: 24),

                // Team Standings Preview
                _buildStandingsPreview(),
                const SizedBox(height: 24),

                // Latest News
                _buildLatestNews(),
                const SizedBox(height: 24),

                // Featured Videos
                _buildFeaturedVideos(),
                const SizedBox(height: 24),

                // Player Spotlight
                _buildPlayerSpotlight(),
                const SizedBox(height: 24),

                // Fantasy Style Cards
                _buildFantasyCards(),
                const SizedBox(height: 24),

                // Gallery
                _buildGallery(),
                const SizedBox(height: 24),

                // Fan Poll
                _buildFanPoll(),
                const SizedBox(height: 24),

                // Sponsors
                _buildSponsors(),
                const SizedBox(height: 100),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomNav(),
      drawer: _buildPremiumDrawer(),
    );
  }

  Widget _buildHeroBanner() {
    return CarouselSlider(
      options: CarouselOptions(
        height: 220,
        viewportFraction: 0.95,
        enlargeCenterPage: true,
        autoPlay: true,
        autoPlayInterval: const Duration(seconds: 5),
        autoPlayAnimationDuration: const Duration(milliseconds: 800),
        onPageChanged: (index, reason) {
          setState(() {
            _bannerIndex = index;
          });
        },
      ),
      items: [
        _buildBannerItem(AppConstants.heroBannerPath, 'IWKL Season 2026', 'The Ultimate Kabaddi League'),
        _buildBannerItem(AppConstants.heroBannerPath, 'Live Matches', 'Watch Every Moment'),
        _buildBannerItem(AppConstants.heroBannerPath, 'Top Raiders', 'Season Highlights'),
      ],
    );
  }

  Widget _buildBannerItem(String imagePath, String title, String subtitle) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          fit: StackFit.expand,
          children: [
            Image.asset(
              imagePath,
              fit: BoxFit.cover,
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
                    Colors.black.withOpacity(0.8),
                  ],
                ),
              ),
            ),
            Positioned(
              bottom: 20,
              left: 20,
              right: 20,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          const Color(AppConstants.accentColorValue),
                          const Color(AppConstants.accentColorValue).withOpacity(0.7),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      AppConstants.seasonName,
                      style: const TextStyle(
                        color: Colors.black,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      shadows: [
                        Shadow(
                          color: Colors.black,
                          blurRadius: 10,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.9),
                      fontSize: 16,
                      shadows: [
                        Shadow(
                          color: Colors.black,
                          blurRadius: 10,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn().scale();
  }

  Widget _buildLiveMatch() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                  ).animate().scale(duration: 500.ms, curve: Curves.easeInOut).then().scale(duration: 500.ms, curve: Curves.easeInOut),
                  const SizedBox(width: 8),
                  const Text(
                    'LIVE',
                    style: TextStyle(
                      color: Colors.red,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                    ),
                  ),
                ],
              ),
              TextButton(
                onPressed: () {},
                child: const Text(
                  'View All',
                  style: TextStyle(color: Color(AppConstants.accentColorValue)),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: GlassCard(
            padding: const EdgeInsets.all(24),
            borderRadius: BorderRadius.circular(24),
            child: Column(
              children: [
                // Match Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(colors: [Colors.red, Colors.redAccent]),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(
                        children: [
                          SizedBox(
                            width: 12,
                            height: 12,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          ),
                          SizedBox(width: 8),
                          Text('LIVE', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                        ],
                      ),
                    ),
                    const Text('Mumbai Arena', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text('Q3 12:45', style: TextStyle(color: Colors.white, fontSize: 12)),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Teams & Score
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildTeamScore('Punjab Wings', 'assets/teams/punjab_wings.jpeg', 25, true),
                    Column(
                      children: [
                        const Text(
                          '25 - 20',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 42,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 4,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [const Color(AppConstants.accentColorValue), const Color(AppConstants.accentColorValue).withOpacity(0.7)],
                            ),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Text(
                            '5 min left',
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    _buildTeamScore('Delhi Warriors', 'assets/teams/delhi_warriors.jpeg', 20, false),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(AppConstants.accentColorValue),
                          foregroundColor: Colors.black,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.play_circle, size: 20),
                            SizedBox(width: 8),
                            Text('Watch Live', style: TextStyle(fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {},
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.white,
                          side: const BorderSide(color: Color(AppConstants.accentColorValue)),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.bar_chart, size: 20),
                            SizedBox(width: 8),
                            Text('Stats', style: TextStyle(fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    ).animate().fadeIn().slideY(begin: 0.2);
  }

  Widget _buildTeamScore(String teamName, String logoPath, int score, bool isHome) {
    return Column(
      children: [
        Container(
          width: 70,
          height: 70,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: const Color(AppConstants.accentColorValue), width: 3),
            boxShadow: [
              BoxShadow(
                color: const Color(AppConstants.accentColorValue).withOpacity(0.3),
                blurRadius: 15,
                spreadRadius: 2,
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
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            '$score',
            style: TextStyle(
              color: isHome ? Colors.black : Colors.white,
              fontSize: 32,
              fontWeight: FontWeight.bold,
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
    ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.2);
  }

  Widget _buildMatchCard(int index) {
    final teams = [
      ['Mumbai Strikers', 'Kashmiri Queens'],
      ['Gujrat Gems', 'Ayodhya Shakti'],
      ['Namma Bengaluru', 'Haryanvi Fighters'],
    ];
    final times = ['Today, 7:30 PM', 'Tomorrow, 6:00 PM', 'Tomorrow, 8:30 PM'];
    
    return GlassCard(
      padding: const EdgeInsets.all(16),
      borderRadius: BorderRadius.circular(16),
      width: 280,
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
                    child: const Icon(Icons.sports_cricket, color: Colors.white),
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
                    child: const Icon(Icons.sports_cricket, color: Colors.white),
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

  Widget _buildTopPlayers() {
    return Column(
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Top Performers',
            style: TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(height: 12),
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
    ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.2);
  }

  Widget _buildPlayerSection(String title, List<Widget> players) {
    return Column(
      children: [
        Text(
          title,
          style: const TextStyle(
            color: Color(AppConstants.accentColorValue),
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        ...players,
      ],
    );
  }

  Widget _buildPlayerCard(String name, String team, int points, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      child: GlassCard(
        padding: const EdgeInsets.all(12),
        borderRadius: BorderRadius.circular(12),
        child: Row(
          children: [
            Container(
              width: 45,
              height: 45,
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: [color, color.withOpacity(0.7)]),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.person, color: Colors.white),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                  Text(team, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 11)),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(AppConstants.accentColorValue), Color(AppConstants.accentColorValue).withOpacity(0.7)]),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text('$points', style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStandingsPreview() {
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
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () {},
                child: const Text(
                  'View Full',
                  style: TextStyle(color: Color(AppConstants.accentColorValue)),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        ...List.generate(3, (index) {
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: GlassCard(
              padding: const EdgeInsets.all(16),
              borderRadius: BorderRadius.circular(16),
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
                    child: const Icon(Icons.sports_cricket, color: Colors.white),
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
                ],
              ),
            ),
          );
        }),
      ],
    ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.2);
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
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () {},
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
    ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.2);
  }

  Widget _buildNewsCard(int index) {
    final titles = [
      'Punjab Wings clinch thriller against Delhi',
      'Mumbai Strikers sign new star raider',
      'Kashmiri Queens dominate in 40-point victory',
    ];
    
    return GlassCard(
      padding: EdgeInsets.zero,
      borderRadius: BorderRadius.circular(16),
      width: 280,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 140,
            decoration: BoxDecoration(
              color: Colors.grey,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            ),
            child: const Center(child: Icon(Icons.article, size: 50, color: Colors.white54)),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titles[index],
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.calendar_today, size: 12, color: Colors.white54),
                    const SizedBox(width: 4),
                    Text('${index + 2}h ago', style: const TextStyle(color: Colors.white54, fontSize: 11)),
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
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () {},
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
    ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.2);
  }

  Widget _buildVideoCard(int index) {
    final titles = [
      'Top 5 Raids of the Week',
      'Match Highlights: Punjab vs Delhi',
      'Best Tackles of Season 2026',
    ];
    
    return GlassCard(
      padding: EdgeInsets.zero,
      borderRadius: BorderRadius.circular(16),
      width: 280,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              Container(
                height: 140,
                decoration: BoxDecoration(
                  color: Colors.grey,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                ),
                child: const Center(child: Icon(Icons.play_circle, size: 50, color: Colors.white54)),
              ),
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.7),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text('10:30', style: TextStyle(color: Colors.white, fontSize: 12)),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titles[index],
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.visibility, size: 12, color: Colors.white54),
                    const SizedBox(width: 4),
                    Text('${(10 + index * 5)}K views', style: const TextStyle(color: Colors.white54, fontSize: 11)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlayerSpotlight() {
    return GlassCard(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      borderRadius: BorderRadius.circular(20),
      child: Row(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(AppConstants.accentColorValue),
                  const Color(AppConstants.accentColorValue).withOpacity(0.7),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(Icons.person, size: 40, color: Colors.black),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(AppConstants.accentColorValue).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    'PLAYER SPOTLIGHT',
                    style: TextStyle(
                      color: Color(AppConstants.accentColorValue),
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Rahul Kumar',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Punjab Wings • Top Raider',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.7),
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(delay: 600.ms).slideX(begin: 0.2);
  }

  Widget _buildFantasyCards() {
    return Column(
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Fantasy Picks',
            style: TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 160,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: 3,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(right: 12),
                child: _buildFantasyCard(index),
              );
            },
          ),
        ),
      ],
    ).animate().fadeIn(delay: 700.ms).slideY(begin: 0.2);
  }

  Widget _buildFantasyCard(int index) {
    final players = ['Rahul Kumar', 'Vikash Kandola', 'Fazel Atrachali'];
    final teams = ['Punjab Wings', 'Delhi Warriors', 'Gujrat Gems'];
    final credits = [15, 14, 13];
    
    return GlassCard(
      padding: const EdgeInsets.all(16),
      borderRadius: BorderRadius.circular(16),
      width: 160,
      child: Column(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(AppConstants.accentColorValue),
                  const Color(AppConstants.accentColorValue).withOpacity(0.7),
                ],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.person, color: Colors.black),
          ),
          const SizedBox(height: 8),
          Text(
            players[index],
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
          ),
          Text(
            teams[index],
            style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 11),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(AppConstants.accentColorValue).withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              '${credits[index]} Credits',
              style: const TextStyle(color: Color(AppConstants.accentColorValue), fontSize: 12, fontWeight: FontWeight.bold),
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
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () {},
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
              borderRadius: BorderRadius.circular(16),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.grey,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Center(child: Icon(Icons.image, color: Colors.white54)),
              ),
            );
          },
        ),
      ],
    ).animate().fadeIn(delay: 800.ms).slideY(begin: 0.2);
  }

  Widget _buildFanPoll() {
    return GlassCard(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      borderRadius: BorderRadius.circular(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.poll, color: Color(AppConstants.accentColorValue)),
              const SizedBox(width: 8),
              const Text(
                'Fan Poll',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
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
    ).animate().fadeIn(delay: 900.ms).slideX(begin: 0.2);
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
                gradient: const LinearGradient(
                  colors: [Color(AppConstants.accentColorValue), Color(AppConstants.accentColorValue).withOpacity(0.7)],
                ),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSponsors() {
    return Column(
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Our Partners',
            style: TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 80,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: 5,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Container(
                  width: 120,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white.withOpacity(0.2)),
                  ),
                  child: const Center(
                    child: Icon(Icons.business, color: Colors.white54),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    ).animate().fadeIn(delay: 1000.ms).slideY(begin: 0.2);
  }

  Widget _buildBottomNav() {
    return Container(
      height: 85,
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(AppConstants.cardColorValue).withOpacity(0.9),
            const Color(AppConstants.primaryColorValue).withOpacity(0.8),
          ],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
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
    );
  }

  Widget _buildNavItem(IconData icon, String label, int index) {
    final isActive = _currentIndex == index;
    return GestureDetector(
      onTap: () {
        setState(() {
          _currentIndex = index;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: isActive
              ? const LinearGradient(colors: [Color(AppConstants.accentColorValue), Color(AppConstants.accentColorValue).withOpacity(0.7)])
              : null,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: isActive ? Colors.black : Colors.white.withOpacity(0.6), size: 24),
            const SizedBox(height: 4),
            Text(label, style: TextStyle(color: isActive ? Colors.black : Colors.white.withOpacity(0.6), fontSize: 11)),
          ],
        ),
      ),
    );
  }

  Widget _buildPremiumDrawer() {
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
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(AppConstants.accentColorValue), width: 3),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(AppConstants.accentColorValue).withOpacity(0.3),
                        blurRadius: 20,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: const Icon(Icons.person, size: 45, color: Colors.white),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Shivam Dubey',
                  style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  'Premium Member 👑',
                  style: TextStyle(
                    color: const Color(AppConstants.accentColorValue),
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
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
      onTap: () {},
    );
  }
}
