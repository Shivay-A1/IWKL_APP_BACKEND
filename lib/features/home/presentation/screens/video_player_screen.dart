import 'dart:html' as html;
import 'dart:ui_web' as ui_web;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
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
  late final html.IFrameElement _iframeElement;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _iframeElement = html.IFrameElement()
      ..src = _getEmbedUrl(widget.videoUrl)
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
    _iframeElement.remove();
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
      body: Stack(
        children: [
          HtmlElementView(viewType: 'video-player-${widget.videoUrl}'),
          if (_isLoading)
            const Center(
              child: CircularProgressIndicator(
                color: AppDesignSystem.primaryPurple,
              ),
            ),
        ],
      ),
    );
  }
}
