// ============================================================================
// ⚠️  GALLERY FUNCTIONALITY LOCKED - DO NOT MODIFY WITHOUT APPROVAL ⚠️
// ============================================================================
// This file contains the gallery screen functionality for the Flutter app.
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
import 'package:http/http.dart' as http;
import 'dart:convert';

class GalleryItem {
  final String id;
  final String title;
  final String mediaUrl;
  final String? category;
  final String? description;
  final bool isFeatured;

  GalleryItem({
    required this.id,
    required this.title,
    required this.mediaUrl,
    this.category,
    this.description,
    required this.isFeatured,
  });

  factory GalleryItem.fromJson(Map<String, dynamic> json) {
    return GalleryItem(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      mediaUrl: json['mediaUrl'] ?? json['imageUrl'] ?? '',
      category: json['category'],
      description: json['description'],
      isFeatured: json['isFeatured'] ?? json['isActive'] ?? true,
    );
  }
}

class GalleryScreen extends StatefulWidget {
  const GalleryScreen({super.key});

  @override
  State<GalleryScreen> createState() => _GalleryScreenState();
}

class _GalleryScreenState extends State<GalleryScreen> {
  List<GalleryItem> _galleryItems = [];
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
        final List<dynamic> items = data['data'] ?? [];
        setState(() {
          _galleryItems = items
              .map((item) => GalleryItem.fromJson(item))
              .where((item) => item.isFeatured)
              .toList();
          _isLoading = false;
        });
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
              : _galleryItems.isEmpty
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
                        childAspectRatio: 0.8,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                      ),
                      itemCount: _galleryItems.length,
                      itemBuilder: (context, index) {
                        return _buildGalleryItem(_galleryItems[index], index);
                      },
                    ),
    );
  }

  Widget _buildGalleryItem(GalleryItem item, int index) {
    return GestureDetector(
      onTap: () => _showDetailDialog(item),
      child: Container(
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                child: CachedNetworkImage(
                  imageUrl: item.mediaUrl.startsWith('http')
                      ? item.mediaUrl
                      : 'https://iwklappbackend-production.up.railway.app${item.mediaUrl}',
                  fit: BoxFit.cover,
                  width: double.infinity,
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
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (item.category != null && item.category!.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF9333EA).withOpacity(0.2),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        item.category!,
                        style: const TextStyle(
                          color: Color(0xFF9333EA),
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                  if (item.description != null && item.description!.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      item.description!,
                      style: const TextStyle(
                        color: Colors.grey,
                        fontSize: 12,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ).animate().fadeIn(duration: 300.ms, delay: (index * 100).ms).scale(begin: const Offset(0.9, 0.9)),
    );
  }

  void _showDetailDialog(GalleryItem item) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: const Color(0xFF13051E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                child: CachedNetworkImage(
                  imageUrl: item.mediaUrl.startsWith('http')
                      ? item.mediaUrl
                      : 'https://iwklappbackend-production.up.railway.app${item.mediaUrl}',
                  fit: BoxFit.cover,
                  width: double.infinity,
                  placeholder: (context, url) => Container(
                    color: const Color(0xFF2D1B4E),
                    height: 300,
                    child: const Center(
                      child: CircularProgressIndicator(
                        color: Color(0xFF9333EA),
                      ),
                    ),
                  ),
                  errorWidget: (context, url, error) => Container(
                    color: const Color(0xFF2D1B4E),
                    height: 300,
                    child: const Center(
                      child: Icon(Icons.image, size: 60, color: Colors.white30),
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.title,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                      ),
                    ),
                    if (item.category != null && item.category!.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFF9333EA).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          item.category!,
                          style: const TextStyle(
                            color: Color(0xFF9333EA),
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                    if (item.description != null && item.description!.isNotEmpty) ...[
                      const SizedBox(height: 12),
                      Text(
                        item.description!,
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 16,
                          height: 1.5,
                        ),
                      ),
                    ],
                    const SizedBox(height: 20),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () => Navigator.pop(context),
                        style: TextButton.styleFrom(
                          backgroundColor: const Color(0xFF9333EA),
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        ),
                        child: const Text(
                          'Close',
                          style: TextStyle(color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
