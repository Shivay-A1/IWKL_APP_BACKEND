class AdminNewsModel {
  String id;
  String title;
  String shortDescription;
  String content;
  String coverImage;
  String category;
  bool featured;
  bool published;
  DateTime publishedAt;
  DateTime createdAt;
  DateTime updatedAt;

  AdminNewsModel({
    required this.id,
    required this.title,
    required this.shortDescription,
    required this.content,
    required this.coverImage,
    required this.category,
    required this.featured,
    required this.published,
    required this.publishedAt,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AdminNewsModel.fromJson(Map<String, dynamic> json) {
    return AdminNewsModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      shortDescription: json['shortDescription'] ?? '',
      content: json['content'] ?? '',
      coverImage: json['coverImage'] ?? '',
      category: json['category'] ?? 'General',
      featured: json['featured'] ?? false,
      published: json['published'] ?? false,
      publishedAt: DateTime.parse(json['publishedAt'] ?? DateTime.now().toIso8601String()),
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'shortDescription': shortDescription,
      'content': content,
      'coverImage': coverImage,
      'category': category,
      'featured': featured,
      'published': published,
      'publishedAt': publishedAt.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  AdminNewsModel copyWith({
    String? id,
    String? title,
    String? shortDescription,
    String? content,
    String? coverImage,
    String? category,
    bool? featured,
    bool? published,
    DateTime? publishedAt,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AdminNewsModel(
      id: id ?? this.id,
      title: title ?? this.title,
      shortDescription: shortDescription ?? this.shortDescription,
      content: content ?? this.content,
      coverImage: coverImage ?? this.coverImage,
      category: category ?? this.category,
      featured: featured ?? this.featured,
      published: published ?? this.published,
      publishedAt: publishedAt ?? this.publishedAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
