import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
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
  late final WebViewController _controller;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            setState(() {
              _isLoading = true;
            });
          },
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false;
            });
          },
        ),
      )
      ..loadRequest(Uri.parse(_getEmbedUrl(widget.videoUrl)));
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
          WebViewWidget(controller: _controller),
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
