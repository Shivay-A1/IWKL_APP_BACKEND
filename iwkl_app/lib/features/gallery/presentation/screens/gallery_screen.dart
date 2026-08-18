import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';

class GalleryScreen extends StatelessWidget {
  const GalleryScreen({super.key});

  static final List<String> _galleryImages = [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400',
    'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?w=400',
    'https://images.unsplash.com/photo-1596554206586-8b89673e073e?w=400',
    'https://images.unsplash.com/photo-1552674605-46d536000ef6?w=400',
    'https://images.unsplash.com/photo-1579952363873-27f3bde9be76?w=400',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: const Text(
          'Gallery',
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
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 1,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemCount: _galleryImages.length,
        itemBuilder: (context, index) {
          return _buildGalleryItem(_galleryImages[index], index);
        },
      ),
    );
  }

  Widget _buildGalleryItem(String imageUrl, int index) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.05),
            Colors.white.withOpacity(0.02),
          ],
        ),
        border: Border.all(
          color: const Color(0xFF9333EA).withOpacity(0.3),
        ),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: CachedNetworkImage(
          imageUrl: imageUrl,
          fit: BoxFit.cover,
          placeholder: (context, url) => Container(
            color: const Color(0xFF2D1B4E),
            child: const Center(
              child: CircularProgressIndicator(
                color: Color(0xFF9333EA),
                strokeWidth: 2,
              ),
            ),
          ),
          errorWidget: (context, url, error) => Container(
            color: const Color(0xFF2D1B4E),
            child: const Center(
              child: Icon(Icons.image, size: 40, color: Colors.white30),
            ),
          ),
          memCacheWidth: 400,
          memCacheHeight: 400,
        ),
      ),
    ).animate().fadeIn(duration: 300.ms, delay: (index * 100).ms).scale(begin: const Offset(0.9, 0.9));
  }
}
