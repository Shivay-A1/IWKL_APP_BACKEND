class Match {
  final String id;
  final String homeTeamId;
  final String awayTeamId;
  final String venue;
  final DateTime scheduledAt;
  final String status;
  final int homeScore;
  final int awayScore;
  final String? homeTeamName;
  final String? homeTeamLogo;
  final String? awayTeamName;
  final String? awayTeamLogo;

  Match({
    required this.id,
    required this.homeTeamId,
    required this.awayTeamId,
    required this.venue,
    required this.scheduledAt,
    required this.status,
    required this.homeScore,
    required this.awayScore,
    this.homeTeamName,
    this.homeTeamLogo,
    this.awayTeamName,
    this.awayTeamLogo,
  });

  // Helper getters for backward compatibility
  String get team1 => homeTeamName ?? 'Home Team';
  String get team2 => awayTeamName ?? 'Away Team';
  String get team1Name => homeTeamName ?? 'Home Team';
  String get team2Name => awayTeamName ?? 'Away Team';
  String get date => _formatDate(scheduledAt);
  String? get team1Logo => homeTeamLogo;
  String? get team2Logo => awayTeamLogo;
  int get team1Score => homeScore;
  int get team2Score => awayScore;
  String get matchTime => _formatMatchTime(scheduledAt, status);

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = date.difference(now);
    
    if (difference.inDays > 0) {
      return '${date.day}/${date.month}/${date.year}';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h';
    } else {
      return '${difference.inMinutes}m';
    }
  }

  String _formatMatchTime(DateTime date, String status) {
    if (status == 'live') {
      return 'LIVE';
    }
    final now = DateTime.now();
    final difference = date.difference(now);
    
    if (difference.inDays > 0) {
      return '${date.hour}:${date.minute.toString().padLeft(2, '0')}';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ${difference.inMinutes % 60}m';
    } else {
      return '${difference.inMinutes}m';
    }
  }

  factory Match.fromJson(Map<String, dynamic> json) {
    return Match(
      id: json['id'] as String,
      homeTeamId: json['homeTeamId'] as String,
      awayTeamId: json['awayTeamId'] as String,
      venue: json['venue'] as String,
      scheduledAt: DateTime.parse(json['scheduledAt'] as String),
      status: json['status'] as String,
      homeScore: json['homeScore'] as int,
      awayScore: json['awayScore'] as int,
      homeTeamName: json['homeTeam']?['name'] as String?,
      homeTeamLogo: json['homeTeam']?['logo'] as String?,
      awayTeamName: json['awayTeam']?['name'] as String?,
      awayTeamLogo: json['awayTeam']?['logo'] as String?,
    );
  }
}
