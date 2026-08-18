class AdminTeamModel {
  String id;
  String name;
  String shortName;
  String slug;
  String logo;
  String primaryColor;
  String secondaryColor;
  String accentColor;
  String description;
  String state;
  String coach;
  String captain;
  int foundedYear;
  String status; // active, inactive
  int displayOrder;
  DateTime createdAt;
  DateTime updatedAt;

  AdminTeamModel({
    required this.id,
    required this.name,
    required this.shortName,
    required this.slug,
    required this.logo,
    required this.primaryColor,
    required this.secondaryColor,
    required this.accentColor,
    required this.description,
    required this.state,
    required this.coach,
    required this.captain,
    required this.foundedYear,
    required this.status,
    required this.displayOrder,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AdminTeamModel.fromJson(Map<String, dynamic> json) {
    return AdminTeamModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      shortName: json['shortName'] ?? '',
      slug: json['slug'] ?? '',
      logo: json['logo'] ?? '',
      primaryColor: json['primaryColor'] ?? '#9333EA',
      secondaryColor: json['secondaryColor'] ?? '#4C085D',
      accentColor: json['accentColor'] ?? '#EC4899',
      description: json['description'] ?? '',
      state: json['state'] ?? '',
      coach: json['coach'] ?? '',
      captain: json['captain'] ?? '',
      foundedYear: json['foundedYear'] ?? 2024,
      status: json['status'] ?? 'active',
      displayOrder: json['displayOrder'] ?? 0,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'shortName': shortName,
      'slug': slug,
      'logo': logo,
      'primaryColor': primaryColor,
      'secondaryColor': secondaryColor,
      'accentColor': accentColor,
      'description': description,
      'state': state,
      'coach': coach,
      'captain': captain,
      'foundedYear': foundedYear,
      'status': status,
      'displayOrder': displayOrder,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  AdminTeamModel copyWith({
    String? id,
    String? name,
    String? shortName,
    String? slug,
    String? logo,
    String? primaryColor,
    String? secondaryColor,
    String? accentColor,
    String? description,
    String? state,
    String? coach,
    String? captain,
    int? foundedYear,
    String? status,
    int? displayOrder,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AdminTeamModel(
      id: id ?? this.id,
      name: name ?? this.name,
      shortName: shortName ?? this.shortName,
      slug: slug ?? this.slug,
      logo: logo ?? this.logo,
      primaryColor: primaryColor ?? this.primaryColor,
      secondaryColor: secondaryColor ?? this.secondaryColor,
      accentColor: accentColor ?? this.accentColor,
      description: description ?? this.description,
      state: state ?? this.state,
      coach: coach ?? this.coach,
      captain: captain ?? this.captain,
      foundedYear: foundedYear ?? this.foundedYear,
      status: status ?? this.status,
      displayOrder: displayOrder ?? this.displayOrder,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
