import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:iwkl_app/core/constants/app_constants.dart';
import 'package:iwkl_app/core/widgets/glass_card.dart';

class OTTScreen extends StatelessWidget {
  const OTTScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      body: CustomScrollView(
        slivers: [
          // Premium App Bar
          SliverAppBar(
            expandedHeight: 120,
            pinned: true,
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
            title: const Text(
              'IWKL OTT',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
            actions: [
              Container(
                margin: const EdgeInsets.only(right: 8),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withOpacity(0.1),
                  border: Border.all(
                    color: const Color(0xFFF4B400).withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: IconButton(
                  icon: const Icon(Icons.search, color: Colors.white),
                  onPressed: () {
                    _showSearchDialog(context);
                  },
                ),
              ),
              Container(
                margin: const EdgeInsets.only(right: 16),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withOpacity(0.1),
                  border: Border.all(
                    color: const Color(0xFFF4B400).withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: IconButton(
                  icon: const Icon(Icons.filter_list, color: Colors.white),
                  onPressed: () {},
                ),
              ),
            ],
          ),

          // Continue Watching
          SliverToBoxAdapter(
            child: _buildSection('Continue Watching'),
          ),
          SliverToBoxAdapter(
            child: _buildHorizontalVideoList(_getContinueWatchingVideos()),
          ),

          // Trending Now
          SliverToBoxAdapter(
            child: _buildSection('Trending Now'),
          ),
          SliverToBoxAdapter(
            child: _buildHorizontalVideoList(_getTrendingVideos()),
          ),

          // Highlights
          SliverToBoxAdapter(
            child: _buildSection('Highlights'),
          ),
          SliverToBoxAdapter(
            child: _buildHorizontalVideoList(_getHighlightVideos()),
          ),

          // Premium Content
          SliverToBoxAdapter(
            child: _buildSection('Premium'),
          ),
          SliverToBoxAdapter(
            child: _buildHorizontalVideoList(_getPremiumVideos()),
          ),

          // Categories
          SliverToBoxAdapter(
            child: _buildSection('Categories'),
          ),
          SliverToBoxAdapter(
            child: _buildCategories(),
          ),

          const SliverToBoxAdapter(
            child: SizedBox(height: 100),
          ),
        ],
      ),
    );
  }

  Widget _buildSection(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 16),
      child: Text(
        title,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 22,
          fontWeight: FontWeight.bold,
          letterSpacing: 1,
        ),
      ).animate().fadeIn(duration: 400.ms).slideX(begin: -0.1),
    );
  }

  Widget _buildHorizontalVideoList(List<VideoItem> videos) {
    return SizedBox(
      height: 180,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: videos.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.only(right: 16),
            child: _buildVideoCard(videos[index]),
          );
        },
      ),
    ).animate().fadeIn(duration: 400.ms, delay: 100.ms).slideX(begin: 0.1);
  }

  Widget _buildVideoCard(VideoItem video) {
    return GestureDetector(
      onTap: () {},
      child: Container(
        width: 280,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              const Color(0xFF4C085D).withOpacity(0.6),
              const Color(0xFF6F1AB6).withOpacity(0.4),
            ],
          ),
          border: Border.all(
            color: const Color(0xFFF4B400).withOpacity(0.3),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFF4B400).withOpacity(0.2),
              blurRadius: 20,
              spreadRadius: 2,
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Stack(
            fit: StackFit.expand,
            children: [
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      const Color(0xFF13051E).withOpacity(0.9),
                    ],
                  ),
                ),
              ),
              Center(
                child: Icon(
                  Icons.play_circle_outline,
                  size: 60,
                  color: Colors.white.withOpacity(0.8),
                ),
              ),
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        video.title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: video.isPremium
                                  ? const Color(0xFFF4B400)
                                  : Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              video.isPremium ? 'PREMIUM' : 'FREE',
                              style: TextStyle(
                                color: video.isPremium
                                    ? const Color(0xFF13051E)
                                    : Colors.white70,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            video.duration,
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.7),
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              if (video.isPremium)
                Positioned(
                  top: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFFF4B400),
                          Color(0xFFFFD700),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFF4B400).withOpacity(0.5),
                          blurRadius: 10,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: const Text(
                      '★',
                      style: TextStyle(
                        color: Color(0xFF13051E),
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategories() {
    final categories = [
      {'name': 'Matches', 'icon': Icons.sports_cricket},
      {'name': 'Highlights', 'icon': Icons.highlight},
      {'name': 'Interviews', 'icon': Icons.mic},
      {'name': 'Documentaries', 'icon': Icons.movie},
      {'name': 'Behind Scenes', 'icon': Icons.video_camera_back},
      {'name': 'Analysis', 'icon': Icons.analytics},
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 1.5,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final category = categories[index];
          return GlassCard(
            padding: const EdgeInsets.all(16),
            borderRadius: BorderRadius.circular(20),
            premiumStyle: true,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  category['icon'] as IconData,
                  color: const Color(0xFFF4B400),
                  size: 32,
                ),
                const SizedBox(height: 8),
                Text(
                  category['name'] as String,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          );
        },
      ),
    ).animate().fadeIn(duration: 400.ms, delay: 200.ms).slideY(begin: 0.2);
  }

  void _showSearchDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E0E3D),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: const Text(
          'Search',
          style: TextStyle(color: Colors.white),
        ),
        content: TextField(
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: 'Search videos...',
            hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
            filled: true,
            fillColor: Colors.white.withOpacity(0.1),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFFF4B400))),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF4B400),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text('Search', style: TextStyle(color: Color(0xFF13051E))),
          ),
        ],
      ),
    );
  }

  List<VideoItem> _getContinueWatchingVideos() {
    return [
      VideoItem('Match Highlights: Delhi vs Mumbai', '12:45', true),
      VideoItem('Best Raids of the Week', '8:30', false),
      VideoItem('Team Analysis: Punjab Wings', '15:20', true),
    ];
  }

  List<VideoItem> _getTrendingVideos() {
    return [
      VideoItem('Top 10 Super Tackles', '10:15', false),
      VideoItem('Championship Final Highlights', '25:00', true),
      VideoItem('Player Interview: Captain', '18:30', true),
      VideoItem('Season Recap', '30:00', true),
    ];
  }

  List<VideoItem> _getHighlightVideos() {
    return [
      VideoItem('Best Moments: Match 1', '5:45', false),
      VideoItem('Super Raid Collection', '7:20', false),
      VideoItem('All-Out Special', '6:10', false),
    ];
  }

  List<VideoItem> _getPremiumVideos() {
    return [
      VideoItem('Exclusive: Behind the Scenes', '45:00', true),
      VideoItem('Documentary: Road to Finals', '60:00', true),
      VideoItem('Masterclass: Raid Techniques', '35:00', true),
    ];
  }
}

class VideoItem {
  final String title;
  final String duration;
  final bool isPremium;

  VideoItem(this.title, this.duration, this.isPremium);
}
