class AdminRegistrationModel {
  String id;
  String playerId;
  String playerName;
  String photo;
  String phone;
  String email;
  String address;
  String documents; // JSON string of document URLs
  String remarks;
  String status; // pending, approved, rejected
  DateTime approvedAt;
  DateTime rejectedAt;
  DateTime createdAt;
  DateTime updatedAt;

  AdminRegistrationModel({
    required this.id,
    required this.playerId,
    required this.playerName,
    required this.photo,
    required this.phone,
    required this.email,
    required this.address,
    required this.documents,
    required this.remarks,
    required this.status,
    required this.approvedAt,
    required this.rejectedAt,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AdminRegistrationModel.fromJson(Map<String, dynamic> json) {
    return AdminRegistrationModel(
      id: json['id'] ?? '',
      playerId: json['playerId'] ?? '',
      playerName: json['playerName'] ?? '',
      photo: json['photo'] ?? '',
      phone: json['phone'] ?? '',
      email: json['email'] ?? '',
      address: json['address'] ?? '',
      documents: json['documents'] ?? '',
      remarks: json['remarks'] ?? '',
      status: json['status'] ?? 'pending',
      approvedAt: DateTime.parse(json['approvedAt'] ?? DateTime.now().toIso8601String()),
      rejectedAt: DateTime.parse(json['rejectedAt'] ?? DateTime.now().toIso8601String()),
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'playerId': playerId,
      'playerName': playerName,
      'photo': photo,
      'phone': phone,
      'email': email,
      'address': address,
      'documents': documents,
      'remarks': remarks,
      'status': status,
      'approvedAt': approvedAt.toIso8601String(),
      'rejectedAt': rejectedAt.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  AdminRegistrationModel copyWith({
    String? id,
    String? playerId,
    String? playerName,
    String? photo,
    String? phone,
    String? email,
    String? address,
    String? documents,
    String? remarks,
    String? status,
    DateTime? approvedAt,
    DateTime? rejectedAt,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AdminRegistrationModel(
      id: id ?? this.id,
      playerId: playerId ?? this.playerId,
      playerName: playerName ?? this.playerName,
      photo: photo ?? this.photo,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      address: address ?? this.address,
      documents: documents ?? this.documents,
      remarks: remarks ?? this.remarks,
      status: status ?? this.status,
      approvedAt: approvedAt ?? this.approvedAt,
      rejectedAt: rejectedAt ?? this.rejectedAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
