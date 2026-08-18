import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'glass_card.dart';
import '../constants/app_constants.dart';

class PremiumStoryBar extends StatelessWidget {
  final List<StoryItem> stories;
  final Function(StoryItem)? onStoryTap;

  const PremiumStoryBar({
    super.key,
    required this.stories,
    this.onStoryTap,
  });

  @override
  Widget build(BuildContext context) {
    if (stories.isEmpty) {
      return const SizedBox.shrink();
    }

    return SizedBox(
      height: 120,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: stories.length,
        itemBuilder: (context, index) {
          final story = stories[index];
          return Padding(
            padding: const EdgeInsets.only(right: 16),
            child: _buildStoryItem(context, story, index),
          );
        },
      ),
    );
  }

  Widget _buildStoryItem(BuildContext context, StoryItem story, int index) {
    return GestureDetector(
      onTap: () => onStoryTap?.call(story),
      child: Column(
        children: [
          // Story Circle with Gradient Border
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [
                  const Color(AppConstants.accentColorValue),
                  const Color(AppConstants.primaryColorValue),
                ],
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.all(3),
              child: Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: const Color(AppConstants.backgroundColorValue),
                    width: 3,
                  ),
                ),
                child: ClipOval(
                  child: story.thumbnail != null
                      ? CachedNetworkImage(
                          imageUrl: story.thumbnail!,
                          fit: BoxFit.cover,
                          width: 66,
                          height: 66,
                          placeholder: (context, url) => Container(
                            color: Colors.grey,
                            child: const Icon(
                              Icons.image,
                              size: 30,
                              color: Colors.white54,
                            ),
                          ),
                          errorWidget: (context, url, error) => Container(
                            color: Colors.grey,
                            child: const Icon(
                              Icons.image,
                              size: 30,
                              color: Colors.white54,
                            ),
                          ),
                        )
                      : Container(
                          color: Colors.grey,
                          child: const Icon(
                            Icons.image,
                            size: 30,
                            color: Colors.white54,
                          ),
                        ),
                ),
              ),
            ),
          ).animate().scale(
            duration: 300.ms,
            curve: Curves.elasticOut,
            delay: (50 * index).ms,
          ),
          const SizedBox(height: 8),
          
          // Story Title
          SizedBox(
            width: 72,
            child: Text(
              story.title ?? 'Story',
              style: const TextStyle(
                fontSize: 11,
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}

class StoryItem {
  final String id;
  final String? thumbnail;
  final String? title;
  final String mediaUrl;
  final String mediaType;
  final DateTime expiresAt;

  StoryItem({
    required this.id,
    this.thumbnail,
    this.title,
    required this.mediaUrl,
    required this.mediaType,
    required this.expiresAt,
  });

  factory StoryItem.fromJson(Map<String, dynamic> json) {
    return StoryItem(
      id: json['id'] as String,
      thumbnail: json['thumbnail'] as String?,
      title: json['title'] as String?,
      mediaUrl: json['mediaUrl'] as String,
      mediaType: json['mediaType'] as String,
      expiresAt: DateTime.parse(json['expiresAt'] as String),
    );
  }
}
