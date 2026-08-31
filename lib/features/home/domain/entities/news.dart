class News {
  final String id;
  final String title;
  final String excerpt;
  final String? thumbnail;
  final DateTime publishedAt;
  final String? category;

  News({
    required this.id,
    required this.title,
    required this.excerpt,
    this.thumbnail,
    required this.publishedAt,
    this.category,
  });

  String get date => _formatDate(publishedAt);

  // Helper getter for backward compatibility
  String? get imageUrl => thumbnail;

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

  factory News.fromJson(Map<String, dynamic> json) {
    return News(
      id: json['id'] as String,
      title: json['title'] as String,
      excerpt: json['excerpt'] ?? '',
      thumbnail: json['thumbnail'] as String?,
      publishedAt: DateTime.parse(json['publishedAt'] as String),
      category: json['category'] as String?,
    );
  }
}
