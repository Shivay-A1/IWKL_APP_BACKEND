// ============================================================================
// ⚠️  NEWS FUNCTIONALITY LOCKED - DO NOT MODIFY WITHOUT APPROVAL ⚠️
// ============================================================================
// This file contains the news screen functionality for the Flutter app.
// Any changes to this file must be approved by the project owner.
//
// BEFORE MAKING CHANGES:
// 1. Get explicit approval from project owner
// 2. Document changes in project documentation
// 3. Test thoroughly in development environment
//
// LOCKED BY: Project Owner
// LOCKED DATE: 2026-10-21
// STATUS: 🔒 LOCKED
// ============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class News {
  final String id;
  final String title;
  final String excerpt;
  final String content;
  final String? featuredImage;
  final String? link;
  final String? category;
  final DateTime? publishedAt;
  final DateTime createdAt;

  News({
    required this.id,
    required this.title,
    required this.excerpt,
    required this.content,
    this.featuredImage,
    this.link,
    this.category,
    this.publishedAt,
    required this.createdAt,
  });

  factory News.fromJson(Map<String, dynamic> json) {
    return News(
      id: json['id'] as String,
      title: json['title'] as String,
      excerpt: json['excerpt'] as String? ?? '',
      content: json['content'] as String? ?? '',
      featuredImage: json['featuredImage'] as String?,
      link: json['link'] as String?,
      category: json['category'] as String?,
      publishedAt: json['publishedAt'] != null ? DateTime.parse(json['publishedAt']) : null,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

class NewsScreen extends StatefulWidget {
  const NewsScreen({super.key});

  @override
  State<NewsScreen> createState() => _NewsScreenState();
}

class _NewsScreenState extends State<NewsScreen> {
  List<News> _newsItems = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchNews();
  }

  Future<void> _fetchNews() async {
    try {
      final response = await http.get(
        Uri.parse('https://iwklappbackend-production.up.railway.app/api/news?limit=100'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print('News response: $data');

        List<dynamic> newsList;
        if (data is Map && data.containsKey('data')) {
          final dataContent = data['data'];
          if (dataContent is List) {
            newsList = dataContent;
          } else {
            newsList = [];
          }
        } else if (data is List) {
          newsList = data;
        } else {
          newsList = [];
        }

        setState(() {
          _newsItems = newsList.map((json) => News.fromJson(json)).toList();
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = 'Failed to load news';
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error fetching news: $e');
      setState(() {
        _error = 'Error loading news';
        _isLoading = false;
      });
    }
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: const Text(
          'News',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF9333EA)))
          : _error != null
              ? Center(child: Text(_error!, style: const TextStyle(color: Colors.white)))
              : _newsItems.isEmpty
                  ? const Center(child: Text('No news available', style: TextStyle(color: Colors.white)))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _newsItems.length,
                      itemBuilder: (context, index) {
                        final news = _newsItems[index];
                        return _buildNewsCard(news, index);
                      },
                    ),
    );
  }

  Widget _buildNewsCard(News news, int index) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => NewsDetailScreen(news: news),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.white.withOpacity(0.05),
              Colors.white.withOpacity(0.02),
            ],
          ),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: const Color(0xFF9333EA).withOpacity(0.3),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
              child: news.featuredImage != null
                  ? CachedNetworkImage(
                      imageUrl: news.featuredImage!,
                      height: 180,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Container(
                        height: 180,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              const Color(0xFF4C085D).withOpacity(0.5),
                              const Color(0xFF6F1AB6).withOpacity(0.3),
                            ],
                          ),
                        ),
                        child: const Center(
                          child: CircularProgressIndicator(
                            color: Color(0xFF9333EA),
                            strokeWidth: 2,
                          ),
                        ),
                      ),
                      errorWidget: (context, url, error) => Container(
                        height: 180,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              const Color(0xFF4C085D).withOpacity(0.5),
                              const Color(0xFF6F1AB6).withOpacity(0.3),
                            ],
                          ),
                        ),
                        child: const Center(
                          child: Icon(Icons.article, size: 40, color: Colors.white54),
                        ),
                      ),
                      memCacheWidth: 600,
                      memCacheHeight: 360,
                    )
                  : Container(
                      height: 180,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            const Color(0xFF4C085D).withOpacity(0.5),
                            const Color(0xFF6F1AB6).withOpacity(0.3),
                          ],
                        ),
                      ),
                      child: const Center(
                        child: Icon(Icons.article, size: 40, color: Colors.white54),
                      ),
                    ),
            ),
            // Content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Category Badge
                  if (news.category != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [
                            Color(0xFF9333EA),
                            Color(0xFFEC4899),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        news.category!,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  const SizedBox(height: 8),
                  // Title
                  Text(
                    news.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Description
                  Text(
                    news.excerpt,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.6),
                      fontSize: 13,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  // Date
                  Row(
                    children: [
                      const Icon(
                        Icons.access_time,
                        size: 14,
                        color: Color(0xFF9333EA),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        news.publishedAt != null
                            ? _formatDate(news.publishedAt!)
                            : _formatDate(news.createdAt),
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.5),
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ).animate().fadeIn(duration: 300.ms, delay: (index * 100).ms).slideY(begin: 0.1, end: 0),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays > 7) {
      return '${date.day}/${date.month}/${date.year}';
    } else if (difference.inDays > 0) {
      return '${difference.inDays} day${difference.inDays > 1 ? 's' : ''} ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hour${difference.inHours > 1 ? 's' : ''} ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minute${difference.inMinutes > 1 ? 's' : ''} ago';
    } else {
      return 'Just now';
    }
  }
}

class NewsDetailScreen extends StatelessWidget {
  final News news;

  const NewsDetailScreen({super.key, required this.news});

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: const Text(
          'News',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image at top
            if (news.featuredImage != null)
              ClipRRect(
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(20),
                  bottomRight: Radius.circular(20),
                ),
                child: CachedNetworkImage(
                  imageUrl: news.featuredImage!,
                  width: double.infinity,
                  height: 250,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    height: 250,
                    color: const Color(0xFF4C085D),
                    child: const Center(
                      child: CircularProgressIndicator(color: Color(0xFF9333EA)),
                    ),
                  ),
                  errorWidget: (context, url, error) => Container(
                    height: 250,
                    color: const Color(0xFF4C085D),
                    child: const Center(
                      child: Icon(Icons.article, size: 40, color: Colors.white54),
                    ),
                  ),
                ),
              ),
            // Content
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Category Badge
                  if (news.category != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [
                            Color(0xFF9333EA),
                            Color(0xFFEC4899),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        news.category!,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  const SizedBox(height: 12),
                  // Title (Heading)
                  Text(
                    news.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Publish Date
                  Row(
                    children: [
                      const Icon(
                        Icons.calendar_today,
                        size: 16,
                        color: Color(0xFF9333EA),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        news.publishedAt != null
                            ? 'Published: ${_formatDate(news.publishedAt!)}'
                            : 'Published: ${_formatDate(news.createdAt)}',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.6),
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  // News Content
                  Text(
                    news.content,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 15,
                      height: 1.6,
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Read More Button (if link exists)
                  if (news.link != null)
                    ElevatedButton.icon(
                      onPressed: () => _launchUrl(news.link!),
                      icon: const Icon(Icons.open_in_new, size: 18),
                      label: const Text('Read More'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF9333EA),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
