class User {
  final String id;
  final String email;
  final String name;
  final String? phone;
  final String? avatar;
  final String role;
  final bool isVerified;
  final String? favoriteTeamId;
  final String? favoritePlayerId;

  User({
    required this.id,
    required this.email,
    required this.name,
    this.phone,
    this.avatar,
    required this.role,
    required this.isVerified,
    this.favoriteTeamId,
    this.favoritePlayerId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String?,
      avatar: json['avatar'] as String?,
      role: json['role'] as String,
      isVerified: json['isVerified'] as bool,
      favoriteTeamId: json['favoriteTeamId'] as String?,
      favoritePlayerId: json['favoritePlayerId'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'phone': phone,
      'avatar': avatar,
      'role': role,
      'isVerified': isVerified,
      'favoriteTeamId': favoriteTeamId,
      'favoritePlayerId': favoritePlayerId,
    };
  }
}
