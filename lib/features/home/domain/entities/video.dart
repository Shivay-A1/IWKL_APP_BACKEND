class Video {
  final String id;
  final String title;
  final String? description;
  final String thumbnail;
  final String videoUrl;
  final int? duration;
  final String? category;
  final bool? isPremium;
  final int? viewCount;
  final String? youtubeUrl;
  final bool? isActive;
  final bool? isFeatured;
  final List<String>? tags;
  final int? displayOrder;
  final String? createdAt;

  Video({
    required this.id,
    required this.title,
    this.description,
    required this.thumbnail,
    required this.videoUrl,
    this.duration,
    this.category,
    this.isPremium,
    this.viewCount,
    this.youtubeUrl,
    this.isActive,
    this.isFeatured,
    this.tags,
    this.displayOrder,
    this.createdAt,
  });

  String get durationString => duration != null ? _formatDuration(duration!) : '0:00';

  // Helper getter for backward compatibility
  String get thumbnailUrl => thumbnail ?? '';
  String get durationFormatted => durationString;

  String get formattedDate {
    if (createdAt == null) return '';
    try {
      final date = DateTime.parse(createdAt!);
      return '${date.day}/${date.month}/${date.year}';
    } catch (e) {
      return '';
    }
  }

  String _formatDuration(int seconds) {
    final minutes = seconds ~/ 60;
    final remainingSeconds = seconds % 60;
    return '${minutes}:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  factory Video.fromJson(Map<String, dynamic> json) {
    return Video(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      thumbnail: (json['thumbnail'] as String?) ?? 
                 (json['thumbnailUrl'] as String?) ?? 
                 (json['imageUrl'] as String?) ?? '',
      videoUrl: (json['videoUrl'] as String?) ?? 
                (json['youtubeUrl'] as String?) ?? '',
      duration: json['duration'] as int?,
      category: json['category'] is String 
          ? json['category'] as String?
          : (json['category'] is Map 
              ? json['category']['name'] as String?
              : null),
      isPremium: json['isPremium'] as bool?,
      viewCount: json['viewCount'] as int?,
      youtubeUrl: json['youtubeUrl'] as String?,
      isActive: json['isActive'] as bool?,
      isFeatured: json['isFeatured'] as bool?,
      tags: json['tags'] != null 
          ? (json['tags'] as List).map((e) => e.toString()).toList()
          : null,
      displayOrder: json['displayOrder'] as int?,
      createdAt: json['createdAt'] as String?,
    );
  }
}
