import 'package:iwkl_app/core/constants/app_constants.dart';

class TeamModel {
  final String id;
  final String name;
  final String shortName;
  final String? logo;
  final String? banner;
  final String? jerseyColor;
  final int? foundedYear;
  final String? city;
  final String? stadiumId;
  final String? coach;
  final String? description;
  final Map<String, dynamic>? socialMedia;
  final bool isActive;
  final String seasonId;
  final DateTime createdAt;
  final DateTime updatedAt;
  final TeamStatsModel? stats;
  final List<PlayerModel>? players;

  TeamModel({
    required this.id,
    required this.name,
    required this.shortName,
    this.logo,
    this.banner,
    this.jerseyColor,
    this.foundedYear,
    this.city,
    this.stadiumId,
    this.coach,
    this.description,
    this.socialMedia,
    required this.isActive,
    required this.seasonId,
    required this.createdAt,
    required this.updatedAt,
    this.stats,
    this.players,
  });

  factory TeamModel.fromJson(Map<String, dynamic> json) {
    return TeamModel(
      id: json['id'] as String,
      name: json['name'] as String,
      shortName: json['shortName'] as String,
      logo: json['logo'] as String?,
      banner: json['banner'] as String?,
      jerseyColor: json['jerseyColor'] as String?,
      foundedYear: json['foundedYear'] as int?,
      city: json['city'] as String?,
      stadiumId: json['stadiumId'] as String?,
      coach: json['coach'] as String?,
      description: json['description'] as String?,
      socialMedia: json['socialMedia'] as Map<String, dynamic>?,
      isActive: json['isActive'] as bool? ?? true,
      seasonId: json['seasonId'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      stats: json['stats'] != null ? TeamStatsModel.fromJson(json['stats'] as Map<String, dynamic>) : null,
      players: json['players'] != null
          ? (json['players'] as List).map((e) => PlayerModel.fromJson(e as Map<String, dynamic>)).toList()
          : null,
    );
  }

  String get logoUrl {
    if (logo == null) return '';
    if (logo!.startsWith('http')) return logo!;
    return '${AppConstants.baseUrl}$logo';
  }

  String get bannerUrl {
    if (banner == null) return '';
    if (banner!.startsWith('http')) return banner!;
    return '${AppConstants.baseUrl}$banner';
  }
}

class TeamStatsModel {
  final int matchesPlayed;
  final int wins;
  final int losses;
  final int draws;
  final int points;
  final int scoreFor;
  final int scoreAgainst;
  final int scoreDifference;
  final double winPercentage;
  final int raidPoints;
  final int tacklePoints;
  final String? currentForm;
  final int highestScore;
  final int lowestScore;
  final int longestWinStreak;
  final int longestLossStreak;

  TeamStatsModel({
    required this.matchesPlayed,
    required this.wins,
    required this.losses,
    required this.draws,
    required this.points,
    required this.scoreFor,
    required this.scoreAgainst,
    required this.scoreDifference,
    required this.winPercentage,
    required this.raidPoints,
    required this.tacklePoints,
    this.currentForm,
    required this.highestScore,
    required this.lowestScore,
    required this.longestWinStreak,
    required this.longestLossStreak,
  });

  factory TeamStatsModel.fromJson(Map<String, dynamic> json) {
    return TeamStatsModel(
      matchesPlayed: json['matchesPlayed'] as int? ?? 0,
      wins: json['wins'] as int? ?? 0,
      losses: json['losses'] as int? ?? 0,
      draws: json['draws'] as int? ?? 0,
      points: json['points'] as int? ?? 0,
      scoreFor: json['scoreFor'] as int? ?? 0,
      scoreAgainst: json['scoreAgainst'] as int? ?? 0,
      scoreDifference: json['scoreDifference'] as int? ?? 0,
      winPercentage: (json['winPercentage'] as num?)?.toDouble() ?? 0.0,
      raidPoints: json['raidPoints'] as int? ?? 0,
      tacklePoints: json['tacklePoints'] as int? ?? 0,
      currentForm: json['currentForm'] as String?,
      highestScore: json['highestScore'] as int? ?? 0,
      lowestScore: json['lowestScore'] as int? ?? 0,
      longestWinStreak: json['longestWinStreak'] as int? ?? 0,
      longestLossStreak: json['longestLossStreak'] as int? ?? 0,
    );
  }
}

class PlayerModel {
  final String id;
  final String name;
  final String? image;
  final int? jerseyNumber;
  final String? position;
  final int? height;
  final int? weight;

  PlayerModel({
    required this.id,
    required this.name,
    this.image,
    this.jerseyNumber,
    this.position,
    this.height,
    this.weight,
  });

  factory PlayerModel.fromJson(Map<String, dynamic> json) {
    return PlayerModel(
      id: json['id'] as String,
      name: json['name'] as String,
      image: json['image'] as String?,
      jerseyNumber: json['jerseyNumber'] as int?,
      position: json['position'] as String?,
      height: json['height'] as int?,
      weight: json['weight'] as int?,
    );
  }
}
