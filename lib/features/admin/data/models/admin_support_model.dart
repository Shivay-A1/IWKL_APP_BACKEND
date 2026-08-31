class AdminSupportModel {
  String id;
  String userId;
  String userName;
  String subject;
  String message;
  String category; // general, technical, billing, registration
  String status; // open, in_progress, resolved, closed
  String priority; // low, medium, high, urgent
  String assignedTo;
  DateTime resolvedAt;
  DateTime createdAt;
  DateTime updatedAt;

  AdminSupportModel({
    required this.id,
    required this.userId,
    required this.userName,
    required this.subject,
    required this.message,
    required this.category,
    required this.status,
    required this.priority,
    required this.assignedTo,
    required this.resolvedAt,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AdminSupportModel.fromJson(Map<String, dynamic> json) {
    return AdminSupportModel(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      userName: json['userName'] ?? '',
      subject: json['subject'] ?? '',
      message: json['message'] ?? '',
      category: json['category'] ?? 'general',
      status: json['status'] ?? 'open',
      priority: json['priority'] ?? 'medium',
      assignedTo: json['assignedTo'] ?? '',
      resolvedAt: DateTime.parse(json['resolvedAt'] ?? DateTime.now().toIso8601String()),
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'userName': userName,
      'subject': subject,
      'message': message,
      'category': category,
      'status': status,
      'priority': priority,
      'assignedTo': assignedTo,
      'resolvedAt': resolvedAt.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  AdminSupportModel copyWith({
    String? id,
    String? userId,
    String? userName,
    String? subject,
    String? message,
    String? category,
    String? status,
    String? priority,
    String? assignedTo,
    DateTime? resolvedAt,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AdminSupportModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      userName: userName ?? this.userName,
      subject: subject ?? this.subject,
      message: message ?? this.message,
      category: category ?? this.category,
      status: status ?? this.status,
      priority: priority ?? this.priority,
      assignedTo: assignedTo ?? this.assignedTo,
      resolvedAt: resolvedAt ?? this.resolvedAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
