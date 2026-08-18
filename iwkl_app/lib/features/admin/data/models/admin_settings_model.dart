class AdminSettingsModel {
  String id;
  String appName;
  String appVersion;
  String supportEmail;
  String supportPhone;
  String privacyPolicy;
  String termsOfService;
  bool maintenanceMode;
  String maintenanceMessage;
  bool allowRegistration;
  int maxPlayersPerTeam;
  DateTime createdAt;
  DateTime updatedAt;

  AdminSettingsModel({
    required this.id,
    required this.appName,
    required this.appVersion,
    required this.supportEmail,
    required this.supportPhone,
    required this.privacyPolicy,
    required this.termsOfService,
    required this.maintenanceMode,
    required this.maintenanceMessage,
    required this.allowRegistration,
    required this.maxPlayersPerTeam,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AdminSettingsModel.fromJson(Map<String, dynamic> json) {
    return AdminSettingsModel(
      id: json['id'] ?? 'default',
      appName: json['appName'] ?? 'IWKL',
      appVersion: json['appVersion'] ?? '1.0.0',
      supportEmail: json['supportEmail'] ?? 'support@iwkl.org',
      supportPhone: json['supportPhone'] ?? '+91-9876543210',
      privacyPolicy: json['privacyPolicy'] ?? '',
      termsOfService: json['termsOfService'] ?? '',
      maintenanceMode: json['maintenanceMode'] ?? false,
      maintenanceMessage: json['maintenanceMessage'] ?? '',
      allowRegistration: json['allowRegistration'] ?? true,
      maxPlayersPerTeam: json['maxPlayersPerTeam'] ?? 15,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'appName': appName,
      'appVersion': appVersion,
      'supportEmail': supportEmail,
      'supportPhone': supportPhone,
      'privacyPolicy': privacyPolicy,
      'termsOfService': termsOfService,
      'maintenanceMode': maintenanceMode,
      'maintenanceMessage': maintenanceMessage,
      'allowRegistration': allowRegistration,
      'maxPlayersPerTeam': maxPlayersPerTeam,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  AdminSettingsModel copyWith({
    String? id,
    String? appName,
    String? appVersion,
    String? supportEmail,
    String? supportPhone,
    String? privacyPolicy,
    String? termsOfService,
    bool? maintenanceMode,
    String? maintenanceMessage,
    bool? allowRegistration,
    int? maxPlayersPerTeam,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AdminSettingsModel(
      id: id ?? this.id,
      appName: appName ?? this.appName,
      appVersion: appVersion ?? this.appVersion,
      supportEmail: supportEmail ?? this.supportEmail,
      supportPhone: supportPhone ?? this.supportPhone,
      privacyPolicy: privacyPolicy ?? this.privacyPolicy,
      termsOfService: termsOfService ?? this.termsOfService,
      maintenanceMode: maintenanceMode ?? this.maintenanceMode,
      maintenanceMessage: maintenanceMessage ?? this.maintenanceMessage,
      allowRegistration: allowRegistration ?? this.allowRegistration,
      maxPlayersPerTeam: maxPlayersPerTeam ?? this.maxPlayersPerTeam,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
