class AdminVideoModel {
  String id;
  String thumbnail;
  String videoUrl;
  String title;
  String description;
  String category;
  String duration; // in format "MM:SS"
  bool featured;
  DateTime createdAt;
  DateTime updatedAt;

  AdminVideoModel({
    required this.id,
    required this.thumbnail,
    required this.videoUrl,
    required this.title,
    required this.description,
    required this.category,
    required this.duration,
    required this.featured,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AdminVideoModel.fromJson(Map<String, dynamic> json) {
    return AdminVideoModel(
      id: json['id'] ?? '',
      thumbnail: json['thumbnail'] ?? '',
      videoUrl: json['videoUrl'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? 'General',
      duration: json['duration'] ?? '00:00',
      featured: json['featured'] ?? false,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'thumbnail': thumbnail,
      'videoUrl': videoUrl,
      'title': title,
      'description': description,
      'category': category,
      'duration': duration,
      'featured': featured,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  AdminVideoModel copyWith({
    String? id,
    String? thumbnail,
    String? videoUrl,
    String? title,
    String? description,
    String? category,
    String? duration,
    bool? featured,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AdminVideoModel(
      id: id ?? this.id,
      thumbnail: thumbnail ?? this.thumbnail,
      videoUrl: videoUrl ?? this.videoUrl,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      duration: duration ?? this.duration,
      featured: featured ?? this.featured,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
