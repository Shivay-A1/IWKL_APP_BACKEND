class AdminPointsTableModel {
  String id;
  String teamId;
  String teamName;
  int played;
  int won;
  int lost;
  int tie;
  int points;
  int scoreDifference;
  int rank;
  DateTime createdAt;
  DateTime updatedAt;

  AdminPointsTableModel({
    required this.id,
    required this.teamId,
    required this.teamName,
    required this.played,
    required this.won,
    required this.lost,
    required this.tie,
    required this.points,
    required this.scoreDifference,
    required this.rank,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AdminPointsTableModel.fromJson(Map<String, dynamic> json) {
    return AdminPointsTableModel(
      id: json['id'] ?? '',
      teamId: json['teamId'] ?? '',
      teamName: json['teamName'] ?? '',
      played: json['played'] ?? 0,
      won: json['won'] ?? 0,
      lost: json['lost'] ?? 0,
      tie: json['tie'] ?? 0,
      points: json['points'] ?? 0,
      scoreDifference: json['scoreDifference'] ?? 0,
      rank: json['rank'] ?? 0,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'teamId': teamId,
      'teamName': teamName,
      'played': played,
      'won': won,
      'lost': lost,
      'tie': tie,
      'points': points,
      'scoreDifference': scoreDifference,
      'rank': rank,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  AdminPointsTableModel copyWith({
    String? id,
    String? teamId,
    String? teamName,
    int? played,
    int? won,
    int? lost,
    int? tie,
    int? points,
    int? scoreDifference,
    int? rank,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AdminPointsTableModel(
      id: id ?? this.id,
      teamId: teamId ?? this.teamId,
      teamName: teamName ?? this.teamName,
      played: played ?? this.played,
      won: won ?? this.won,
      lost: lost ?? this.lost,
      tie: tie ?? this.tie,
      points: points ?? this.points,
      scoreDifference: scoreDifference ?? this.scoreDifference,
      rank: rank ?? this.rank,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
