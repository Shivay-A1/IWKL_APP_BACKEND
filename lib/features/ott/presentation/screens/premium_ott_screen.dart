import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../home/domain/entities/video.dart';
import '../../../home/presentation/screens/video_player_screen.dart';
import 'category_videos_screen.dart';

class PremiumOTTScreen extends StatefulWidget {
  const PremiumOTTScreen({super.key});

  @override
  State<PremiumOTTScreen> createState() => _PremiumOTTScreenState();
}

class _PremiumOTTScreenState extends State<PremiumOTTScreen> {
  List<Video> _videos = [];
  bool _isLoading = true;
  Map<String, List<Video>> _videosByCategory = {};
  List<String> _categories = [];

  @override
  void initState() {
    super.initState();
    _fetchVideos();
  }

  Future<void> _fetchVideos() async {
    try {
      final response = await http.get(
        Uri.parse('https://iwklappbackend-production.up.railway.app/api/videos'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List<dynamic> videosData = data['data'] ?? [];
        
        setState(() {
          _videos = videosData.map((json) => Video.fromJson(json)).toList();
          _groupVideosByCategory();
          _extractCategories();
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error fetching videos: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _groupVideosByCategory() {
    _videosByCategory = {};
    for (final video in _videos) {
      final category = video.category ?? 'All';
      if (!_videosByCategory.containsKey(category)) {
        _videosByCategory[category] = [];
      }
      _videosByCategory[category]!.add(video);
    }
  }

  void _extractCategories() {
    _categories = _videosByCategory.keys.toList();
    // Ensure Featured is first
    if (_categories.contains('Featured')) {
      _categories.remove('Featured');
      _categories.insert(0, 'Featured');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppDesignSystem.primaryBackground,
      body: CustomScrollView(
        slivers: [
          // Hero Banner - Full Width Card
          SliverAppBar(
            expandedHeight: 500,
            pinned: false,
            backgroundColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                children: [
                  // Full Width Banner Background
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          AppDesignSystem.primaryBackground,
                          Colors.black,
                        ],
                      ),
                    ),
                  ),
                  // Banner Image (Optional - you can add real image here)
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            Colors.transparent,
                            AppDesignSystem.primaryBackground,
                          ],
                        ),
                      ),
                    ),
                  ),
                  // Banner Content
                  Positioned(
                    bottom: 30,
                    left: 20,
                    right: 20,
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: AppDesignSystem.cardGradient,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: AppDesignSystem.gold.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              gradient: AppDesignSystem.goldGradient,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text(
                              'LIVE NOW',
                              style: TextStyle(
                                color: Colors.black,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'IWKL Season 2026',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Watch all matches live and on-demand',
                            style: TextStyle(
                              color: AppDesignSystem.secondaryText,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 20),
                          Row(
                            children: [
                              ElevatedButton.icon(
                                onPressed: () {},
                                icon: const Icon(Icons.play_arrow, size: 20),
                                label: const Text('Watch Now'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppDesignSystem.primaryPurple,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(25),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 16),
                              OutlinedButton.icon(
                                onPressed: () {},
                                icon: const Icon(Icons.info_outline, size: 20),
                                label: const Text('Info'),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: Colors.white,
                                  side: const BorderSide(color: Colors.white),
                                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(25),
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
              ),
            ),
          ),

          // Featured Videos
          if (_videosByCategory['featured'] != null && _videosByCategory['featured']!.isNotEmpty) ...[
            SliverToBoxAdapter(
              child: _buildSection('Featured'),
            ),
            SliverToBoxAdapter(
              child: _buildHorizontalVideoList(_videosByCategory['featured']!),
            ),
          ],

          // Videos by Category
          ..._categories.where((cat) => cat != 'Featured').map((category) {
            return [
              SliverToBoxAdapter(
                child: _buildSection(category),
              ),
              SliverToBoxAdapter(
                child: _buildHorizontalVideoList(_videosByCategory[category] ?? []),
              ),
            ];
          }).expand((e) => e),

          // Categories Grid
          SliverToBoxAdapter(
            child: _buildSection('Categories'),
          ),
          SliverToBoxAdapter(
            child: _buildCategoriesGrid(),
          ),
        ],
      ),
    );
  }

  Widget _buildSection(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppDesignSystem.lgSpacing,
        vertical: AppDesignSystem.lgSpacing,
      ),
      child: Row(
        children: [
          GestureDetector(
            onTap: () {
              Navigator.pushNamed(context, '/category-videos', arguments: title);
            },
            child: Text(
              title,
              style: AppDesignSystem.mediumSectionTitle,
            ),
          ),
          const Spacer(),
          TextButton(
            onPressed: () {
              Navigator.pushNamed(context, '/category-videos', arguments: title);
            },
            child: const Text(
              'See All',
              style: TextStyle(
                color: AppDesignSystem.gold,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHorizontalVideoList(List<Video> videos) {
    if (videos.isEmpty) {
      return const SizedBox.shrink();
    }

    return SizedBox(
      height: 200,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.lgSpacing),
        itemCount: videos.length,
        itemBuilder: (context, index) {
          return _buildVideoCard(videos[index], index);
        },
      ),
    );
  }

  Widget _buildVideoCard(Video video, int index) {
    final videoUrl = video.youtubeUrl ?? video.videoUrl;
    final isYouTube = videoUrl.contains('youtube.com') || videoUrl.contains('youtu.be');

    return Container(
      width: 320,
      margin: const EdgeInsets.only(right: AppDesignSystem.mdSpacing),
      child: PremiumCard(
        onTap: () {
          if (isYouTube) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => VideoPlayerScreen(
                  videoUrl: videoUrl,
                  title: video.title,
                  description: video.description,
                  suggestedVideos: _videos,
                ),
              ),
            );
          }
        },
        padding: EdgeInsets.zero,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thumbnail
            Expanded(
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(AppDesignSystem.xlRadius),
                      topRight: Radius.circular(AppDesignSystem.xlRadius),
                    ),
                    child: Image.network(
                      video.thumbnail,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          decoration: BoxDecoration(
                            gradient: AppDesignSystem.cardGradient,
                          ),
                          child: const Center(
                            child: Icon(
                              Icons.play_circle,
                              size: 50,
                              color: AppDesignSystem.mutedText,
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  // Duration Badge
                  if (video.duration != null)
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.7),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          video.durationString,
                          style: const TextStyle(color: Colors.white, fontSize: 10),
                        ),
                      ),
                    ),
                  // Play Button Overlay
                  const Center(
                    child: Icon(
                      Icons.play_circle_outline,
                      size: 60,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
            // Info
            Padding(
              padding: const EdgeInsets.all(AppDesignSystem.mdSpacing),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    video.title,
                    style: AppDesignSystem.readableBody,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    video.formattedDate,
                    style: AppDesignSystem.softGreyCaption,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(duration: AppDesignSystem.fastAnimation).scale(
      begin: const Offset(0.95, 0.95),
      end: const Offset(1, 1),
      curve: AppDesignSystem.smoothCurve,
      delay: Duration(milliseconds: index * 50),
    );
  }

  Widget _buildCategoriesGrid() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.lgSpacing),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          childAspectRatio: 1.3,
          crossAxisSpacing: AppDesignSystem.mdSpacing,
          mainAxisSpacing: AppDesignSystem.mdSpacing,
        ),
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final category = _categories[index];
          return GestureDetector(
            onTap: () {
              Navigator.pushNamed(context, '/category-videos', arguments: category);
            },
            child: PremiumCard(
              padding: const EdgeInsets.all(AppDesignSystem.mdSpacing),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    _getCategoryIcon(category),
                  color: AppDesignSystem.gold,
                  size: 32,
                ),
                  const SizedBox(height: 8),
                  Text(
                    category,
                    style: AppDesignSystem.readableBody,
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  IconData _getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'featured':
        return Icons.star;
      case 'matches':
        return Icons.sports_cricket;
      case 'highlights':
        return Icons.highlight;
      case 'interviews':
        return Icons.mic;
      case 'documentaries':
        return Icons.movie;
      case 'behind scenes':
        return Icons.video_camera_back;
      case 'analysis':
        return Icons.analytics;
      default:
        return Icons.video_library;
    }
  }
}
