class AdminFanClubModel {
  String id;
  String fullName;
  String mobile;
  String email;
  String state;
  String city;
  String supportedTeam;
  String supportedTeamId;
  DateTime createdAt;
  DateTime updatedAt;

  AdminFanClubModel({
    required this.id,
    required this.fullName,
    required this.mobile,
    required this.email,
    required this.state,
    required this.city,
    required this.supportedTeam,
    required this.supportedTeamId,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AdminFanClubModel.fromJson(Map<String, dynamic> json) {
    return AdminFanClubModel(
      id: json['id'] ?? '',
      fullName: json['fullName'] ?? '',
      mobile: json['mobile'] ?? '',
      email: json['email'] ?? '',
      state: json['state'] ?? '',
      city: json['city'] ?? '',
      supportedTeam: json['supportedTeam'] ?? '',
      supportedTeamId: json['supportedTeamId'] ?? '',
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'mobile': mobile,
      'email': email,
      'state': state,
      'city': city,
      'supportedTeam': supportedTeam,
      'supportedTeamId': supportedTeamId,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  AdminFanClubModel copyWith({
    String? id,
    String? fullName,
    String? mobile,
    String? email,
    String? state,
    String? city,
    String? supportedTeam,
    String? supportedTeamId,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AdminFanClubModel(
      id: id ?? this.id,
      fullName: fullName ?? this.fullName,
      mobile: mobile ?? this.mobile,
      email: email ?? this.email,
      state: state ?? this.state,
      city: city ?? this.city,
      supportedTeam: supportedTeam ?? this.supportedTeam,
      supportedTeamId: supportedTeamId ?? this.supportedTeamId,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
