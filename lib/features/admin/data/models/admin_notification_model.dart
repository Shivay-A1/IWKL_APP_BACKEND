class AdminNotificationModel {
  String id;
  String title;
  String message;
  String audience; // all, users, players, specific
  List<String> targetIds;
  bool pushNotification;
  DateTime scheduledAt;
  bool sent;
  DateTime sentAt;
  DateTime createdAt;
  DateTime updatedAt;

  AdminNotificationModel({
    required this.id,
    required this.title,
    required this.message,
    required this.audience,
    required this.targetIds,
    required this.pushNotification,
    required this.scheduledAt,
    required this.sent,
    required this.sentAt,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AdminNotificationModel.fromJson(Map<String, dynamic> json) {
    return AdminNotificationModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      message: json['message'] ?? '',
      audience: json['audience'] ?? 'all',
      targetIds: List<String>.from(json['targetIds'] ?? []),
      pushNotification: json['pushNotification'] ?? true,
      scheduledAt: DateTime.parse(json['scheduledAt'] ?? DateTime.now().toIso8601String()),
      sent: json['sent'] ?? false,
      sentAt: DateTime.parse(json['sentAt'] ?? DateTime.now().toIso8601String()),
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'message': message,
      'audience': audience,
      'targetIds': targetIds,
      'pushNotification': pushNotification,
      'scheduledAt': scheduledAt.toIso8601String(),
      'sent': sent,
      'sentAt': sentAt.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  AdminNotificationModel copyWith({
    String? id,
    String? title,
    String? message,
    String? audience,
    List<String>? targetIds,
    bool? pushNotification,
    DateTime? scheduledAt,
    bool? sent,
    DateTime? sentAt,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AdminNotificationModel(
      id: id ?? this.id,
      title: title ?? this.title,
      message: message ?? this.message,
      audience: audience ?? this.audience,
      targetIds: targetIds ?? this.targetIds,
      pushNotification: pushNotification ?? this.pushNotification,
      scheduledAt: scheduledAt ?? this.scheduledAt,
      sent: sent ?? this.sent,
      sentAt: sentAt ?? this.sentAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
