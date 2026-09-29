import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class GalleryScreen extends StatefulWidget {
  const GalleryScreen({super.key});

  @override
  State<GalleryScreen> createState() => _GalleryScreenState();
}

class _GalleryScreenState extends State<GalleryScreen> {
  List<String> _galleryImages = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadGalleryImages();
  }

  Future<void> _loadGalleryImages() async {
    try {
      final response = await http.get(
        Uri.parse('https://iwklappbackend-production.up.railway.app/api/gallery'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        // Handle both response formats: {success: true, data: [...]} and {data: [...]}
        final galleryData = data['data'] ?? data;
        if (galleryData is List) {
          setState(() {
            _galleryImages = galleryData
                .map((item) {
                  String mediaUrl = item['mediaUrl'] as String;
                  // Convert relative path to full URL
                  if (mediaUrl.startsWith('/uploads/')) {
                    mediaUrl = 'https://iwklappbackend-production.up.railway.app$mediaUrl';
                  }
                  return mediaUrl;
                })
                .toList();
            _isLoading = false;
          });
        } else {
          setState(() {
            _galleryImages = [];
            _isLoading = false;
          });
        }
      } else {
        setState(() {
          _error = 'Failed to load gallery';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Error loading gallery: $e';
        _isLoading = false;
      });
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
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                color: Color(0xFF9333EA),
              ),
            )
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, size: 50, color: Colors.white30),
                      const SizedBox(height: 16),
                      Text(
                        _error!,
                        style: const TextStyle(color: Colors.white70),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadGalleryImages,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF9333EA),
                        ),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : _galleryImages.isEmpty
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.photo_library, size: 50, color: Colors.white30),
                          SizedBox(height: 16),
                          Text(
                            'No images in gallery',
                            style: TextStyle(color: Colors.white70),
                          ),
                        ],
                      ),
                    )
                  : GridView.builder(
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
