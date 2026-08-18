import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../constants/app_constants.dart';
import 'glass_card.dart';

class PremiumNewsCard extends StatelessWidget {
  final NewsArticle news;
  final VoidCallback? onTap;

  const PremiumNewsCard({
    super.key,
    required this.news,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 280,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 15,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: GlassCard(
          borderRadius: BorderRadius.circular(16),
          padding: EdgeInsets.zero,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Thumbnail
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                child: news.thumbnail != null
                    ? CachedNetworkImage(
                        imageUrl: news.thumbnail!,
                        height: 160,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        placeholder: (context, url) => Container(
                          height: 160,
                          color: Colors.grey,
                          child: const Center(
                            child: CircularProgressIndicator(
                              color: Color(AppConstants.accentColorValue),
                            ),
                          ),
                        ),
                        errorWidget: (context, url, error) => Container(
                          height: 160,
                          color: Colors.grey,
                          child: const Icon(Icons.article, color: Colors.white54),
                        ),
                      )
                    : Container(
                        height: 160,
                        color: Colors.grey,
                        child: const Icon(Icons.article, color: Colors.white54),
                      ),
              ),
              
              // Content
              Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Category Badge
                    if (news.category != null)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              const Color(AppConstants.accentColorValue),
                              const Color(AppConstants.accentColorValue).withOpacity(0.7),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          news.category!,
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 10,
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
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    
                    // Excerpt
                    if (news.excerpt != null)
                      Text(
                        news.excerpt!,
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.6),
                          fontSize: 12,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    const SizedBox(height: 8),
                    
                    // Meta Info
                    Row(
                      children: [
                        const Icon(Icons.person, size: 12, color: Colors.white54),
                        const SizedBox(width: 4),
                        Text(
                          news.author,
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 11,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Icon(Icons.calendar_today, size: 12, color: Colors.white54),
                        const SizedBox(width: 4),
                        Text(
                          _formatDate(news.publishedAt),
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 11,
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
      ).animate().fadeIn().scale(),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);
    
    if (difference.inDays == 0) {
      if (difference.inHours == 0) {
        return '${difference.inMinutes}m ago';
      }
      return '${difference.inHours}h ago';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    }
    return '${date.day}/${date.month}/${date.year}';
  }
}

class NewsArticle {
  final String id;
  final String title;
  final String? excerpt;
  final String? thumbnail;
  final String? category;
  final String author;
  final DateTime publishedAt;

  NewsArticle({
    required this.id,
    required this.title,
    this.excerpt,
    this.thumbnail,
    this.category,
    required this.author,
    required this.publishedAt,
  });

  factory NewsArticle.fromJson(Map<String, dynamic> json) {
    return NewsArticle(
      id: json['id'] as String,
      title: json['title'] as String,
      excerpt: json['excerpt'] as String?,
      thumbnail: json['thumbnail'] as String?,
      category: json['category'] as String?,
      author: json['author'] as String,
      publishedAt: DateTime.parse(json['publishedAt'] as String),
    );
  }
}
