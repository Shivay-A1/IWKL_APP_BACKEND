class User {
  final String id;
  final String? email;
  final String firstName;
  final String mobile;
  final String? avatar;
  final String role;
  final bool? isPhoneVerified;
  final String? favoriteTeamId;
  final String? favoritePlayerId;

  User({
    required this.id,
    this.email,
    required this.firstName,
    required this.mobile,
    this.avatar,
    required this.role,
    this.isPhoneVerified,
    this.favoriteTeamId,
    this.favoritePlayerId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      email: json['email'] as String?,
      firstName: json['firstName'] as String,
      mobile: json['mobile'] as String,
      avatar: json['avatar'] as String?,
      role: json['role'] as String,
      isPhoneVerified: json['isPhoneVerified'] as bool?,
      favoriteTeamId: json['favoriteTeamId'] as String?,
      favoritePlayerId: json['favoritePlayerId'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'firstName': firstName,
      'mobile': mobile,
      'avatar': avatar,
      'role': role,
      'isPhoneVerified': isPhoneVerified,
      'favoriteTeamId': favoriteTeamId,
      'favoritePlayerId': favoritePlayerId,
    };
  }
}
