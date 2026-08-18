class Story {
  final String id;
  final String mediaUrl;
  final String mediaType;
  final String? thumbnail;
  final String? title;
  final DateTime expiresAt;
  final bool? isSeen;

  Story({
    required this.id,
    required this.mediaUrl,
    required this.mediaType,
    this.thumbnail,
    this.title,
    required this.expiresAt,
    this.isSeen,
  });

  // Helper getter for backward compatibility
  String? get imageUrl => mediaUrl;

  factory Story.fromJson(Map<String, dynamic> json) {
    return Story(
      id: json['id'] as String,
      mediaUrl: json['mediaUrl'] as String,
      mediaType: json['mediaType'] as String,
      thumbnail: json['thumbnail'] as String?,
      title: json['title'] as String?,
      expiresAt: DateTime.parse(json['expiresAt'] as String),
      isSeen: json['isSeen'] as bool?,
    );
  }
}
