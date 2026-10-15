import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/theme/app_design_system.dart';

class _VideoData {
  final String id;
  final String title;
  final String? description;
  final String thumbnail;
  final String videoUrl;
  final int? duration;
  final int? viewCount;

  _VideoData({
    required this.id,
    required this.title,
    this.description,
    required this.thumbnail,
    required this.videoUrl,
    this.duration,
    this.viewCount,
  });

  factory _VideoData.fromDynamic(dynamic data) {
    return _VideoData(
      id: data['id'] as String? ?? '',
      title: data['title'] as String? ?? '',
      description: data['description'] as String?,
      thumbnail: (data['thumbnail'] as String?) ?? 
                 (data['thumbnailUrl'] as String?) ?? '',
      videoUrl: (data['videoUrl'] as String?) ?? 
                (data['youtubeUrl'] as String?) ?? '',
      duration: data['duration'] as int?,
      viewCount: data['viewCount'] as int?,
    );
  }
}

class CinematicVideoPlayerScreen extends StatefulWidget {
  final String videoUrl;
  final String title;
  final String? description;
  final String? thumbnailUrl;
  final List<dynamic>? suggestedVideos;

  const CinematicVideoPlayerScreen({
    super.key,
    required this.videoUrl,
    required this.title,
    this.description,
    this.thumbnailUrl,
    this.suggestedVideos,
  });

  @override
  State<CinematicVideoPlayerScreen> createState() => _CinematicVideoPlayerScreenState();
}

class _CinematicVideoPlayerScreenState extends State<CinematicVideoPlayerScreen> {
  late VideoPlayerController _videoPlayerController;
  ChewieController? _chewieController;
  bool _isLoading = true;
  bool _hasError = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _initializePlayer();
  }

  Future<void> _initializePlayer() async {
    try {
      _videoPlayerController = VideoPlayerController.networkUrl(
        Uri.parse(widget.videoUrl),
      );

      await _videoPlayerController.initialize();

      _chewieController = ChewieController(
        videoPlayerController: _videoPlayerController,
        autoPlay: true,
        looping: false,
        showControls: true,
        aspectRatio: _videoPlayerController.value.aspectRatio,
        allowFullScreen: true,
        allowMuting: true,
        allowPlaybackSpeedChanging: true,
        autoInitialize: true,
        errorBuilder: (context, errorMessage) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 64, color: Colors.red),
                const SizedBox(height: 16),
                Text(
                  'Error loading video',
                  style: TextStyle(color: AppDesignSystem.getPrimaryText(context)),
                ),
                const SizedBox(height: 8),
                Text(
                  errorMessage,
                  style: TextStyle(
                    color: AppDesignSystem.getSecondaryText(context),
                    fontSize: 12,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          );
        },
      );

      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _hasError = true;
          _errorMessage = e.toString();
        });
      }
    }
  }

  @override
  void dispose() {
    _videoPlayerController.dispose();
    _chewieController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppDesignSystem.getPrimaryBackground(context),
      appBar: AppBar(
        backgroundColor: AppDesignSystem.getPrimaryBackground(context),
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back,
            color: AppDesignSystem.getPrimaryText(context),
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          widget.title,
          style: TextStyle(
            color: AppDesignSystem.getPrimaryText(context),
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(
              Icons.share,
              color: AppDesignSystem.getPrimaryText(context),
            ),
            onPressed: () {
              // TODO: Implement share functionality
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Video Player
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Container(
                color: Colors.black,
                child: _isLoading
                    ? const Center(
                        child: CircularProgressIndicator(
                          color: AppDesignSystem.primaryPurple,
                        ),
                      )
                    : _hasError
                        ? _buildErrorWidget()
                        : Chewie(controller: _chewieController!),
              ),
            ),
            // Title and Description
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.title,
                    style: TextStyle(
                      color: AppDesignSystem.getPrimaryText(context),
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (widget.description != null && widget.description!.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Text(
                      widget.description!,
                      style: TextStyle(
                        color: AppDesignSystem.getSecondaryText(context),
                        fontSize: 14,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            // Suggested Videos
            if (widget.suggestedVideos != null && widget.suggestedVideos!.isNotEmpty) ...[
              const SizedBox(height: 16),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  'Suggested Videos',
                  style: TextStyle(
                    color: AppDesignSystem.getPrimaryText(context),
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              _buildSuggestedVideos(),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildErrorWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 64, color: Colors.red),
          const SizedBox(height: 16),
          Text(
            'Error loading video',
            style: TextStyle(color: AppDesignSystem.getPrimaryText(context)),
          ),
          const SizedBox(height: 8),
          if (_errorMessage != null)
            Text(
              _errorMessage!,
              style: TextStyle(
                color: AppDesignSystem.getSecondaryText(context),
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
        ],
      ),
    );
  }

  Widget _buildSuggestedVideos() {
    return SizedBox(
      height: 120,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: widget.suggestedVideos!.length,
        itemBuilder: (context, index) {
          final video = _VideoData.fromDynamic(widget.suggestedVideos![index]);
          return Container(
            width: 200,
            margin: const EdgeInsets.only(right: 12),
            child: _buildSuggestedVideoCard(video),
          );
        },
      ),
    );
  }

  Widget _buildSuggestedVideoCard(_VideoData video) {
    return GestureDetector(
      onTap: () {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => CinematicVideoPlayerScreen(
              videoUrl: video.videoUrl,
              title: video.title,
              description: video.description,
              thumbnailUrl: video.thumbnail,
              suggestedVideos: widget.suggestedVideos,
            ),
          ),
        );
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: CachedNetworkImage(
                  imageUrl: video.thumbnail,
                  height: 70,
                  width: 200,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    height: 70,
                    width: 200,
                    color: Colors.grey[800],
                    child: const Center(
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: AppDesignSystem.primaryPurple,
                      ),
                    ),
                  ),
                  errorWidget: (context, url, error) => Container(
                    height: 70,
                    width: 200,
                    color: Colors.grey[800],
                    child: const Icon(Icons.play_circle_outline, color: Colors.grey),
                  ),
                ),
              ),
              Positioned(
                bottom: 4,
                right: 4,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.7),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    video.duration != null ? _formatDuration(video.duration!) : '',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            video.title,
            style: TextStyle(
              color: AppDesignSystem.getPrimaryText(context),
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Text(
            video.viewCount != null ? '${video.viewCount} views' : '0 views',
            style: TextStyle(
              color: AppDesignSystem.getSecondaryText(context),
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }

  String _formatDuration(int seconds) {
    final minutes = seconds ~/ 60;
    final remainingSeconds = seconds % 60;
    return '${minutes}:${remainingSeconds.toString().padLeft(2, '0')}';
  }
}
