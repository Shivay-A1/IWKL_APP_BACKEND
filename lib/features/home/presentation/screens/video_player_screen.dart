import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/theme/app_design_system.dart';

class VideoPlayerScreen extends StatefulWidget {
  final String videoUrl;
  final String title;

  const VideoPlayerScreen({
    super.key,
    required this.videoUrl,
    required this.title,
  });

  @override
  State<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> {
  String? _embedUrl;
  bool _isLoading = true;
  bool _hasError = false;
  bool _triedEmbedding = false;

  @override
  void initState() {
    super.initState();
    _loadVideo();
  }

  void _loadVideo() {
    final videoId = _extractVideoId(widget.videoUrl);
    if (videoId.isEmpty) {
      setState(() {
        _isLoading = false;
        _hasError = true;
      });
      return;
    }

    // Use regular YouTube embed with specific parameters for Shorts
    _embedUrl = 'https://www.youtube.com/embed/$videoId?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&controls=1&fs=1&iv_load_policy=3&widget_referrer&origin=https://www.youtube.com&start=0';

    _createIframe(_embedUrl!);
  }

  void _createIframe(String embedUrl) {
    // For mobile platforms, directly launch in browser
    if (!kIsWeb) {
      _launchInBrowser();
      return;
    }

    // For web builds, we'd use html.IFrameElement and ui_web.platformViewRegistry
    // but for now, let's just fallback to browser launch
    _launchInBrowser();
  }

  String _extractVideoId(String url) {
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
        return match.group(1)!;
      }
    }
    return '';
  }

  Future<void> _launchInBrowser() async {
    setState(() {
      _triedEmbedding = true;
      _isLoading = false;
    });
    
    final uri = Uri.parse(widget.videoUrl);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
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
              Icons.open_in_new,
              color: AppDesignSystem.getPrimaryText(context),
            ),
            onPressed: _launchInBrowser,
            tooltip: 'Open in Browser',
          ),
        ],
      ),
      body: _hasError
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: 64,
                    color: AppDesignSystem.getSecondaryText(context),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Failed to load video',
                    style: TextStyle(
                      color: AppDesignSystem.getPrimaryText(context),
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: _launchInBrowser,
                    icon: const Icon(Icons.open_in_new),
                    label: const Text('Open in Browser'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppDesignSystem.primaryPurple,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ],
              ),
            )
          : _isLoading
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const CircularProgressIndicator(
                        color: AppDesignSystem.primaryPurple,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Loading video in app...',
                        style: TextStyle(
                          color: AppDesignSystem.getSecondaryText(context),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Will open in browser if unavailable',
                        style: TextStyle(
                          color: AppDesignSystem.getSecondaryText(context),
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                )
              : Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.play_circle_outline,
                        size: 64,
                        color: AppDesignSystem.primaryPurple,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Video will open in browser',
                        style: TextStyle(
                          color: AppDesignSystem.getPrimaryText(context),
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
}
