import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../home/domain/entities/video.dart';
import '../../../home/presentation/screens/video_player_screen.dart';

class CategoryVideosScreen extends StatefulWidget {
  final String category;
  final String? categoryId;

  const CategoryVideosScreen({
    super.key,
    required this.category,
    this.categoryId,
  });

  @override
  State<CategoryVideosScreen> createState() => _CategoryVideosScreenState();
}

class _CategoryVideosScreenState extends State<CategoryVideosScreen> {
  List<Video> _videos = [];
  bool _isLoading = true;

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
          _videos = videosData
              .map((json) => Video.fromJson(json))
              .where((video) => widget.category == 'Featured'
                  ? video.isFeatured == true
                  : (video.category?.toLowerCase() == widget.category.toLowerCase()))
              .toList();
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppDesignSystem.primaryBackground,
      appBar: AppBar(
        backgroundColor: AppDesignSystem.primaryBackground,
        title: Text(
          widget.category,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(AppDesignSystem.gold),
              ),
            )
          : _videos.isEmpty
              ? Center(
                  child: Text(
                    'No videos found in ${widget.category}',
                    style: AppDesignSystem.readableBody,
                  ),
                )
              : GridView.builder(
                  padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.75,
                    crossAxisSpacing: AppDesignSystem.mdSpacing,
                    mainAxisSpacing: AppDesignSystem.mdSpacing,
                  ),
                  itemCount: _videos.length,
                  itemBuilder: (context, index) {
                    return _buildVideoCard(_videos[index], index);
                  },
                ),
    );
  }

  Widget _buildVideoCard(Video video, int index) {
    final videoUrl = video.youtubeUrl ?? video.videoUrl;
    final isYouTube = videoUrl.contains('youtube.com') || videoUrl.contains('youtu.be');

    return PremiumCard(
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
    ).animate().fadeIn(duration: AppDesignSystem.fastAnimation).scale(
      begin: const Offset(0.95, 0.95),
      end: const Offset(1, 1),
      curve: AppDesignSystem.smoothCurve,
      delay: Duration(milliseconds: index * 50),
    );
  }
}
