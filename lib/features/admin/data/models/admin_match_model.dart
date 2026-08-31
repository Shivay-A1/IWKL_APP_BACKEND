class AdminMatchModel {
  String id;
  String teamAId;
  String teamAName;
  String teamBId;
  String teamBName;
  String venue;
  DateTime date;
  String time;
  String leagueStage; // Group Stage, Quarter Final, Semi Final, Final
  String referee;
  String liveStatus; // not_started, live, completed
  String matchStatus; // scheduled, in_progress, completed, cancelled
  int teamAScore;
  int teamBScore;
  DateTime createdAt;
  DateTime updatedAt;

  AdminMatchModel({
    required this.id,
    required this.teamAId,
    required this.teamAName,
    required this.teamBId,
    required this.teamBName,
    required this.venue,
    required this.date,
    required this.time,
    required this.leagueStage,
    required this.referee,
    required this.liveStatus,
    required this.matchStatus,
    required this.teamAScore,
    required this.teamBScore,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AdminMatchModel.fromJson(Map<String, dynamic> json) {
    return AdminMatchModel(
      id: json['id'] ?? '',
      teamAId: json['teamAId'] ?? '',
      teamAName: json['teamAName'] ?? '',
      teamBId: json['teamBId'] ?? '',
      teamBName: json['teamBName'] ?? '',
      venue: json['venue'] ?? '',
      date: DateTime.parse(json['date'] ?? DateTime.now().toIso8601String()),
      time: json['time'] ?? '19:00',
      leagueStage: json['leagueStage'] ?? 'Group Stage',
      referee: json['referee'] ?? '',
      liveStatus: json['liveStatus'] ?? 'not_started',
      matchStatus: json['matchStatus'] ?? 'scheduled',
      teamAScore: json['teamAScore'] ?? 0,
      teamBScore: json['teamBScore'] ?? 0,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'teamAId': teamAId,
      'teamAName': teamAName,
      'teamBId': teamBId,
      'teamBName': teamBName,
      'venue': venue,
      'date': date.toIso8601String(),
      'time': time,
      'leagueStage': leagueStage,
      'referee': referee,
      'liveStatus': liveStatus,
      'matchStatus': matchStatus,
      'teamAScore': teamAScore,
      'teamBScore': teamBScore,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  AdminMatchModel copyWith({
    String? id,
    String? teamAId,
    String? teamAName,
    String? teamBId,
    String? teamBName,
    String? venue,
    DateTime? date,
    String? time,
    String? leagueStage,
    String? referee,
    String? liveStatus,
    String? matchStatus,
    int? teamAScore,
    int? teamBScore,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AdminMatchModel(
      id: id ?? this.id,
      teamAId: teamAId ?? this.teamAId,
      teamAName: teamAName ?? this.teamAName,
      teamBId: teamBId ?? this.teamBId,
      teamBName: teamBName ?? this.teamBName,
      venue: venue ?? this.venue,
      date: date ?? this.date,
      time: time ?? this.time,
      leagueStage: leagueStage ?? this.leagueStage,
      referee: referee ?? this.referee,
      liveStatus: liveStatus ?? this.liveStatus,
      matchStatus: matchStatus ?? this.matchStatus,
      teamAScore: teamAScore ?? this.teamAScore,
      teamBScore: teamBScore ?? this.teamBScore,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
