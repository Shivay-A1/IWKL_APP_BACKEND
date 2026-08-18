import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';

class NewsScreen extends StatelessWidget {
  const NewsScreen({super.key});

  final List<Map<String, dynamic>> _newsItems = const [
    {
      'title': 'Gujarat Gems Win Thrilling Match',
      'category': 'Match Report',
      'date': '2 hours ago',
      'image': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
      'description': 'Gujarat Gems secured a stunning victory against Maharashtra Mavericks in a high-octane match.',
    },
    {
      'title': 'Season 2026 Schedule Announced',
      'category': 'Announcement',
      'date': '1 day ago',
      'image': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400',
      'description': 'The official schedule for IWKL Season 2026 has been released with exciting matchups.',
    },
    {
      'title': 'Top Raiders of the Season',
      'category': 'Statistics',
      'date': '2 days ago',
      'image': 'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?w=400',
      'description': 'Meet the top raiders who are dominating the current season with their exceptional performances.',
    },
    {
      'title': 'Fan Club Membership Now Open',
      'category': 'News',
      'date': '3 days ago',
      'image': 'https://images.unsplash.com/photo-1596554206586-8b89673e073e?w=400',
      'description': 'Join the official IWKL Fan Club to get exclusive benefits and rewards.',
    },
  ];

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
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _newsItems.length,
        itemBuilder: (context, index) {
          final news = _newsItems[index];
          return _buildNewsCard(news, index);
        },
      ),
    );
  }

  Widget _buildNewsCard(Map<String, dynamic> news, int index) {
    return Container(
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
            child: CachedNetworkImage(
              imageUrl: news['image'],
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
            ),
          ),
          // Content
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Category Badge
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
                    news['category'],
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
                  news['title'],
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                // Description
                Text(
                  news['description'],
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
                      news['date'],
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
    ).animate().fadeIn(duration: 300.ms, delay: (index * 100).ms).slideY(begin: 0.1, end: 0);
  }
}
