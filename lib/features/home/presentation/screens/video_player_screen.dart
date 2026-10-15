import 'dart:html' as html;
import 'dart:ui_web' as ui_web;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/theme/app_design_system.dart';

class VideoPlayerScreen extends StatefulWidget {
  final String videoUrl;
  final String title;
  final String? description;
  final List<dynamic>? suggestedVideos;

  const VideoPlayerScreen({
    super.key,
    required this.videoUrl,
    required this.title,
    this.description,
    this.suggestedVideos,
  });

  @override
  State<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> {
  late final html.IFrameElement _iframeElement;
  bool _isLoading = true;
  bool _isYouTube = false;
  List<dynamic> _filteredSuggestedVideos = [];

  @override
  void initState() {
    super.initState();
    // Filter out the current video from suggested videos
    if (widget.suggestedVideos != null) {
      print('VideoPlayerScreen: Total suggested videos received: ${widget.suggestedVideos!.length}');
      _filteredSuggestedVideos = widget.suggestedVideos!.where((video) {
        final videoUrl = video is Map ? video['youtubeUrl'] : video.youtubeUrl;
        final altVideoUrl = video is Map ? video['videoUrl'] : video.videoUrl;
        final actualUrl = (videoUrl != null && videoUrl.isNotEmpty) ? videoUrl : altVideoUrl;
        final isDifferent = actualUrl != widget.videoUrl;
        print('VideoPlayerScreen: Video URL - $actualUrl, Current - ${widget.videoUrl}, Keep: $isDifferent');
        return isDifferent;
      }).toList();
      print('VideoPlayerScreen: Filtered suggested videos count: ${_filteredSuggestedVideos.length}');
    } else {
      print('VideoPlayerScreen: suggestedVideos is null');
    }

  @override
  void initState() {
    super.initState();
    _isYouTube = _isYouTubeUrl(widget.videoUrl);
    
    if (_isYouTube) {
      final embedUrl = _getEmbedUrl(widget.videoUrl);
      _iframeElement = html.IFrameElement()
        ..src = embedUrl
        ..style.width = '100%'
        ..style.height = '100%'
        ..style.border = 'none'
        ..allowFullscreen = true;

      // Register the iframe element with Flutter
      // ignore: undefined_prefixed_name
      ui_web.platformViewRegistry.registerViewFactory(
        'video-player-${widget.videoUrl}',
        (int viewId) => _iframeElement,
      );

      // Listen for iframe load event
      _iframeElement.onLoad.listen((_) {
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
        }
      });
    } else {
      // For non-YouTube URLs, open externally after a short delay
      Future.delayed(const Duration(milliseconds: 500), () {
        if (mounted) {
          _launchExternalVideo();
        }
      });
      setState(() {
        _isLoading = false;
      });
    }
  }

  bool _isYouTubeUrl(String url) {
    return url.contains('youtube.com') || url.contains('youtu.be');
  }

  Future<void> _launchExternalVideo() async {
    final uri = Uri.parse(widget.videoUrl);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  String _getEmbedUrl(String url) {
    // Extract YouTube video ID from various URL formats
    final patterns = [
      RegExp(r'youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)'),
      RegExp(r'youtube\.com\/embed\/([a-zA-Z0-9_-]+)'),
      RegExp(r'youtube\.com\/shorts\/([a-zA-Z0-9_-]+)'),
      RegExp(r'youtu\.be\/([a-zA-Z0-9_-]+)'),
    ];

    for (final pattern in patterns) {
      final match = pattern.firstMatch(url);
      if (match != null) {
        final videoId = match.group(1)!;
        // Use YouTube embed with autoplay and other parameters
        return 'https://www.youtube.com/embed/$videoId?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&controls=1&fs=1';
      }
    }
    
    // If not a YouTube URL, return the original URL
    return url;
  }

  @override
  void dispose() {
    if (_isYouTube) {
      _iframeElement.remove();
    }
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
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Video Player
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Stack(
                children: [
                  if (_isYouTube)
                    HtmlElementView(viewType: 'video-player-${widget.videoUrl}')
                  else
                    Container(
                      color: Colors.black,
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.play_circle_outline,
                              size: 64,
                              color: Colors.white,
                            ),
                            const SizedBox(height: 16),
                            ElevatedButton.icon(
                              onPressed: _launchExternalVideo,
                              icon: const Icon(Icons.open_in_new),
                              label: const Text('Watch Video'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppDesignSystem.primaryPurple,
                                foregroundColor: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  if (_isLoading)
                    const Center(
                      child: CircularProgressIndicator(
                        color: AppDesignSystem.primaryPurple,
                      ),
                    ),
                ],
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
            if (_filteredSuggestedVideos.isNotEmpty) ...[
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

  Widget _buildSuggestedVideos() {
    return SizedBox(
      height: 180,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _filteredSuggestedVideos.length,
        itemBuilder: (context, index) {
          final video = _filteredSuggestedVideos[index];
          return Container(
            width: 250,
            margin: const EdgeInsets.only(right: 12),
            child: _buildSuggestedVideoCard(video),
          );
        },
      ),
    );
  }

  Widget _buildSuggestedVideoCard(dynamic video) {
    final title = video is Map ? video['title'] : video.title;
    final thumbnail = video is Map ? video['thumbnail'] : video.thumbnail;
    final thumbnailUrl = video is Map ? video['thumbnailUrl'] : video.thumbnailUrl;
    final finalThumbnail = (thumbnail != null && thumbnail.isNotEmpty) ? thumbnail : thumbnailUrl;
    final videoUrl = video is Map ? video['youtubeUrl'] : video.youtubeUrl;
    final actualVideoUrl = (videoUrl != null && videoUrl.isNotEmpty) ? videoUrl : (video is Map ? video['videoUrl'] : video.videoUrl);
    final createdAt = video is Map ? video['createdAt'] : video.createdAt;

    String formattedDate = '';
    if (createdAt != null) {
      try {
        final date = DateTime.parse(createdAt);
        formattedDate = '${date.day}/${date.month}/${date.year}';
      } catch (e) {
        formattedDate = '';
      }
    }

    return GestureDetector(
      onTap: () {
        final isYouTube = actualVideoUrl.contains('youtube.com') || actualVideoUrl.contains('youtu.be');
        
        if (isYouTube) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => VideoPlayerScreen(
                videoUrl: actualVideoUrl,
                title: title ?? 'Video',
                description: video is Map ? video['description'] : video.description,
                suggestedVideos: widget.suggestedVideos,
              ),
            ),
          );
        }
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: CachedNetworkImage(
                  imageUrl: finalThumbnail ?? '',
                  height: 110,
                  width: 250,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    height: 110,
                    width: 250,
                    color: Colors.grey[800],
                    child: const Center(
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: AppDesignSystem.primaryPurple,
                      ),
                    ),
                  ),
                  errorWidget: (context, url, error) => Container(
                    height: 110,
                    width: 250,
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
                  child: const Icon(
                    Icons.play_circle,
                    color: Colors.white,
                    size: 16,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            title ?? 'Video',
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
            formattedDate,
            style: TextStyle(
              color: AppDesignSystem.getSecondaryText(context),
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }
}
