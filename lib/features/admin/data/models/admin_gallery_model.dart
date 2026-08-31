class AdminGalleryModel {
  String id;
  String image;
  String title;
  String category;
  List<String> tags;
  bool featured;
  DateTime createdAt;
  DateTime updatedAt;

  AdminGalleryModel({
    required this.id,
    required this.image,
    required this.title,
    required this.category,
    required this.tags,
    required this.featured,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AdminGalleryModel.fromJson(Map<String, dynamic> json) {
    return AdminGalleryModel(
      id: json['id'] ?? '',
      image: json['image'] ?? '',
      title: json['title'] ?? '',
      category: json['category'] ?? 'General',
      tags: List<String>.from(json['tags'] ?? []),
      featured: json['featured'] ?? false,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'image': image,
      'title': title,
      'category': category,
      'tags': tags,
      'featured': featured,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  AdminGalleryModel copyWith({
    String? id,
    String? image,
    String? title,
    String? category,
    List<String>? tags,
    bool? featured,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AdminGalleryModel(
      id: id ?? this.id,
      image: image ?? this.image,
      title: title ?? this.title,
      category: category ?? this.category,
      tags: tags ?? this.tags,
      featured: featured ?? this.featured,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
