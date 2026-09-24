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
      id: json['id']?.toString() ?? '',
      mediaUrl: json['imageUrl']?.toString() ?? json['videoUrl']?.toString() ?? json['mediaUrl']?.toString() ?? '',
      mediaType: json['isVideo'] == true ? 'video' : 'image',
      thumbnail: json['imageUrl']?.toString() ?? json['videoUrl']?.toString() ?? json['thumbnail']?.toString(),
      title: json['title']?.toString() ?? json['caption']?.toString() ?? '',
      expiresAt: json['expiryTime'] != null 
          ? DateTime.parse(json['expiryTime'] as String)
          : DateTime.now().add(const Duration(days: 7)),
      isSeen: json['isSeen'] as bool?,
    );
  }
}
