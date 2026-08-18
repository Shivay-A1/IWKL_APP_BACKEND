import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../constants/app_constants.dart';
import 'glass_card.dart';

class PremiumLiveMatchCard extends StatelessWidget {
  final LiveMatchData match;
  final VoidCallback? onWatchLive;

  const PremiumLiveMatchCard({
    super.key,
    required this.match,
    this.onWatchLive,
  });

  @override
  Widget build(BuildContext context) {
    return PremiumCard(
      glowColor: const Color(AppConstants.accentColorValue),
      glowIntensity: 0.5,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              const Color(AppConstants.primaryColorValue),
              const Color(AppConstants.secondaryColorValue),
            ],
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // LIVE Badge with Animation
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Colors.red, Colors.redAccent],
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.red.withOpacity(0.5),
                          blurRadius: 10,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        SizedBox(
                          width: 12,
                          height: 12,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        ).animate().rotate(duration: 1000.ms, infinite: true),
                        const SizedBox(width: 6),
                        const Text(
                          'LIVE',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Venue
                  Text(
                    match.venue,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.7),
                      fontSize: 12,
                    ),
                  ),
                  // Quarter
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Q${match.quarter}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Teams and Score
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  // Home Team
                  _buildTeamColumn(
                    match.homeTeamName,
                    match.homeTeamLogo,
                    match.homeScore,
                    true,
                  ),
                  
                  // Score Display
                  _buildScoreDisplay(match.homeScore, match.awayScore),
                  
                  // Away Team
                  _buildTeamColumn(
                    match.awayTeamName,
                    match.awayTeamLogo,
                    match.awayScore,
                    false,
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Match Timer
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.timer, color: Color(AppConstants.accentColorValue), size: 16),
                    const SizedBox(width: 8),
                    Text(
                      match.timer,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Watch Live Button
              ElevatedButton.icon(
                onPressed: onWatchLive,
                icon: const Icon(Icons.play_circle_outline, size: 20),
                label: const Text('Watch Live'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(AppConstants.accentColorValue),
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                  shadowColor: const Color(AppConstants.accentColorValue).withOpacity(0.5),
                ),
              ),
            ],
          ),
        ),
      ),
    ).animate().fadeIn().scale();
  }

  Widget _buildTeamColumn(String? teamName, String? teamLogo, int score, bool isHome) {
    return Column(
      children: [
        // Team Logo
        Container(
          width: 70,
          height: 70,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: Colors.white.withOpacity(0.3),
              width: 2,
            ),
          ),
          child: ClipOval(
            child: teamLogo != null
                ? CachedNetworkImage(
                    imageUrl: teamLogo,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: Colors.grey,
                      child: const Icon(Icons.sports_cricket, color: Colors.white54),
                    ),
                    errorWidget: (context, url, error) => Container(
                      color: Colors.grey,
                      child: const Icon(Icons.sports_cricket, color: Colors.white54),
                    ),
                  )
                : Container(
                    color: Colors.grey,
                    child: const Icon(Icons.sports_cricket, color: Colors.white54),
                  ),
          ),
        ),
        const SizedBox(height: 12),
        
        // Team Name
        SizedBox(
          width: 80,
          child: Text(
            teamName ?? 'Team',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        const SizedBox(height: 8),
        
        // Score
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                const Color(AppConstants.accentColorValue),
                const Color(AppConstants.accentColorValue).withOpacity(0.7),
              ],
            ),
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: const Color(AppConstants.accentColorValue).withOpacity(0.3),
                blurRadius: 10,
                spreadRadius: 2,
              ),
            ],
          ),
          child: Text(
            score.toString(),
            style: const TextStyle(
              color: Colors.black,
              fontSize: 28,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildScoreDisplay(int homeScore, int awayScore) {
    return Column(
      children: [
        Row(
          children: [
            Text(
              homeScore.toString(),
              style: const TextStyle(
                color: Colors.white,
                fontSize: 48,
                fontWeight: FontWeight.bold,
                shadows: [
                  Shadow(
                    color: Colors.black,
                    blurRadius: 20,
                    offset: Offset(0, 5),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              '-',
              style: TextStyle(
                color: Colors.white,
                fontSize: 48,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(width: 8),
            Text(
              awayScore.toString(),
              style: const TextStyle(
                color: Colors.white,
                fontSize: 48,
                fontWeight: FontWeight.bold,
                shadows: [
                  Shadow(
                    color: Colors.black,
                    blurRadius: 20,
                    offset: Offset(0, 5),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: const Text(
            'SCORE',
            style: TextStyle(
              color: Colors.white,
              fontSize: 10,
              fontWeight: FontWeight.w500,
              letterSpacing: 2,
            ),
          ),
        ),
      ],
    );
  }
}

class LiveMatchData {
  final String? homeTeamName;
  final String? homeTeamLogo;
  final int homeScore;
  final String? awayTeamName;
  final String? awayTeamLogo;
  final int awayScore;
  final String venue;
  final int quarter;
  final String timer;

  LiveMatchData({
    this.homeTeamName,
    this.homeTeamLogo,
    required this.homeScore,
    this.awayTeamName,
    this.awayTeamLogo,
    required this.awayScore,
    required this.venue,
    required this.quarter,
    required this.timer,
  });

  factory LiveMatchData.fromJson(Map<String, dynamic> json) {
    return LiveMatchData(
      homeTeamName: json['homeTeam']?['name'] as String?,
      homeTeamLogo: json['homeTeam']?['logo'] as String?,
      homeScore: json['homeScore'] as int,
      awayTeamName: json['awayTeam']?['name'] as String?,
      awayTeamLogo: json['awayTeam']?['logo'] as String?,
      awayScore: json['awayScore'] as int,
      venue: json['venue'] as String,
      quarter: json['quarter'] as int,
      timer: json['timer'] as String,
    );
  }
}
