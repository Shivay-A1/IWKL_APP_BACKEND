class AdminPlayerModel {
  String id;
  String photo;
  String name;
  int jerseyNumber;
  String position; // Raider, Defender, All-Rounder
  int age;
  DateTime dob;
  double height; // in cm
  double weight; // in kg
  String state;
  String teamId;
  String teamName;
  String phone;
  String email;
  String status; // active, inactive, injured
  DateTime createdAt;
  DateTime updatedAt;

  AdminPlayerModel({
    required this.id,
    required this.photo,
    required this.name,
    required this.jerseyNumber,
    required this.position,
    required this.age,
    required this.dob,
    required this.height,
    required this.weight,
    required this.state,
    required this.teamId,
    required this.teamName,
    required this.phone,
    required this.email,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AdminPlayerModel.fromJson(Map<String, dynamic> json) {
    return AdminPlayerModel(
      id: json['id'] ?? '',
      photo: json['photo'] ?? '',
      name: json['name'] ?? '',
      jerseyNumber: json['jerseyNumber'] ?? 0,
      position: json['position'] ?? 'Raider',
      age: json['age'] ?? 20,
      dob: DateTime.parse(json['dob'] ?? DateTime.now().toIso8601String()),
      height: (json['height'] ?? 170).toDouble(),
      weight: (json['weight'] ?? 70).toDouble(),
      state: json['state'] ?? '',
      teamId: json['teamId'] ?? '',
      teamName: json['teamName'] ?? '',
      phone: json['phone'] ?? '',
      email: json['email'] ?? '',
      status: json['status'] ?? 'active',
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'photo': photo,
      'name': name,
      'jerseyNumber': jerseyNumber,
      'position': position,
      'age': age,
      'dob': dob.toIso8601String(),
      'height': height,
      'weight': weight,
      'state': state,
      'teamId': teamId,
      'teamName': teamName,
      'phone': phone,
      'email': email,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  AdminPlayerModel copyWith({
    String? id,
    String? photo,
    String? name,
    int? jerseyNumber,
    String? position,
    int? age,
    DateTime? dob,
    double? height,
    double? weight,
    String? state,
    String? teamId,
    String? teamName,
    String? phone,
    String? email,
    String? status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AdminPlayerModel(
      id: id ?? this.id,
      photo: photo ?? this.photo,
      name: name ?? this.name,
      jerseyNumber: jerseyNumber ?? this.jerseyNumber,
      position: position ?? this.position,
      age: age ?? this.age,
      dob: dob ?? this.dob,
      height: height ?? this.height,
      weight: weight ?? this.weight,
      state: state ?? this.state,
      teamId: teamId ?? this.teamId,
      teamName: teamName ?? this.teamName,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
