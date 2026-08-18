class Video {
  final String id;
  final String title;
  final String thumbnail;
  final String videoUrl;
  final int duration;
  final String category;
  final bool isPremium;
  final int viewCount;

  Video({
    required this.id,
    required this.title,
    required this.thumbnail,
    required this.videoUrl,
    required this.duration,
    required this.category,
    required this.isPremium,
    required this.viewCount,
  });

  String get durationString => _formatDuration(duration);

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
      thumbnail: json['thumbnail'] as String,
      videoUrl: json['videoUrl'] as String,
      duration: json['duration'] as int,
      category: json['category'] as String,
      isPremium: json['isPremium'] as bool,
      viewCount: json['viewCount'] as int,
    );
  }
}
