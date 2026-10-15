import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../home/domain/entities/video.dart';
import '../../../home/presentation/screens/video_player_screen.dart';

class PremiumOTTScreen extends StatefulWidget {
  const PremiumOTTScreen({super.key});

  @override
  State<PremiumOTTScreen> createState() => _PremiumOTTScreenState();
}

class _PremiumOTTScreenState extends State<PremiumOTTScreen> {
  List<Video> _videos = [];
  bool _isLoading = true;
  Map<String, List<Video>> _videosByCategory = {};

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppDesignSystem.primaryBackground,
      body: CustomScrollView(
        slivers: [
          // Hero Banner
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            backgroundColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                children: [
                  // Hero Image
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
                  // Gradient Overlay
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
                  // Content
                  Positioned(
                    bottom: 20,
                    left: 20,
                    right: 20,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            gradient: AppDesignSystem.goldGradient,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'LIVE NOW',
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'IWKL Season 2026',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Watch all matches live and on-demand',
                          style: TextStyle(
                            color: AppDesignSystem.secondaryText,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            ElevatedButton.icon(
                              onPressed: () {},
                              icon: const Icon(Icons.play_arrow, size: 18),
                              label: const Text('Watch Now'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppDesignSystem.primaryPurple,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            OutlinedButton.icon(
                              onPressed: () {},
                              icon: const Icon(Icons.info_outline, size: 18),
                              label: const Text('Info'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.white,
                                side: const BorderSide(color: Colors.white),
                                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
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
          ..._videosByCategory.entries.where((e) => e.key != 'featured').map((entry) {
            return [
              SliverToBoxAdapter(
                child: _buildSection(entry.key),
              ),
              SliverToBoxAdapter(
                child: _buildHorizontalVideoList(entry.value),
              ),
            ];
          }).expand((e) => e),
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
          Text(
            title,
            style: AppDesignSystem.mediumSectionTitle,
          ),
          const Spacer(),
          TextButton(
            onPressed: () {},
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
}
