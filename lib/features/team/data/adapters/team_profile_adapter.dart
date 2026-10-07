import 'package:iwkl_app/features/team/data/models/team_model.dart';
import 'package:iwkl_app/features/team/presentation/screens/team_profile_screen.dart';

class TeamProfileAdapter {
  static TeamProfileData fromTeamModel(TeamModel team) {
    return TeamProfileData(
      name: team.name,
      logo: team.logoUrl.isNotEmpty ? team.logoUrl : null,
      tagline: team.description,
      founded: team.foundedYear,
      coach: team.coach,
      captain: null, // Not in Team model yet
      homeGround: team.city,
      played: team.stats?.matchesPlayed ?? 0,
      won: team.stats?.wins ?? 0,
      lost: team.stats?.losses ?? 0,
      points: team.stats?.points ?? 0,
      raidPoints: team.stats?.raidPoints,
      tacklePoints: team.stats?.tacklePoints,
      superRaids: null, // Not in TeamStats yet
      superTackles: null, // Not in TeamStats yet
      allOuts: null, // Not in TeamStats yet
      players: team.players?.map((p) => PlayerData(
        name: p.name,
        role: p.position ?? 'Player',
        jerseyNumber: p.jerseyNumber ?? 0,
        avatar: p.image,
      )).toList() ?? [],
      achievements: [], // Will need separate API call
      recentMatches: [], // Will need separate API call
      gallery: [], // Will need separate API call
      videos: [], // Will need separate API call
      sponsors: [], // Will need separate API call
      socialMedia: team.socialMedia ?? {},
    );
  }
}
