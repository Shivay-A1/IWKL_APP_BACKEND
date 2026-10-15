class Video {
  final String id;
  final String title;
  final String thumbnail;
  final String videoUrl;
  final int? duration;
  final String? category;
  final bool? isPremium;
  final int? viewCount;
  final String? youtubeUrl;
  final bool? isActive;

  Video({
    required this.id,
    required this.title,
    required this.thumbnail,
    required this.videoUrl,
    this.duration,
    this.category,
    this.isPremium,
    this.viewCount,
    this.youtubeUrl,
    this.isActive,
  });

  String get durationString => duration != null ? _formatDuration(duration!) : '0:00';

  // Helper getter for backward compatibility
  String get thumbnailUrl => thumbnail;
  String get durationFormatted => durationString;

  String _formatDuration(int seconds) {
    final minutes = seconds ~/ 60;
    final remainingSeconds = seconds % 60;
    return '${minutes}:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  factory Video.fromJson(Map<String, dynamic> json) {
    return Video(
      id: json['id'] as String,
      title: json['title'] as String,
      thumbnail: (json['thumbnail'] as String?) ?? (json['imageUrl'] as String?) ?? '',
      videoUrl: (json['videoUrl'] as String?) ?? (json['youtubeUrl'] as String?) ?? '',
      duration: json['duration'] as int?,
      category: json['category'] as String?,
      isPremium: json['isPremium'] as bool?,
      viewCount: json['viewCount'] as int?,
      youtubeUrl: json['youtubeUrl'] as String?,
      isActive: json['isActive'] as bool?,
    );
  }
}
