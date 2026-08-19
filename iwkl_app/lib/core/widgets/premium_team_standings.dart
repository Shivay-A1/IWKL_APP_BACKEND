import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../constants/app_constants.dart';
import 'glass_card.dart';

class PremiumTeamStandings extends StatefulWidget {
  final List<TeamStanding> standings;
  final Function(TeamStanding)? onTeamTap;

  const PremiumTeamStandings({
    super.key,
    required this.standings,
    this.onTeamTap,
  });

  @override
  State<PremiumTeamStandings> createState() => _PremiumTeamStandingsState();
}

class _PremiumTeamStandingsState extends State<PremiumTeamStandings> {
  final Map<int, bool> _expandedCards = {};

  @override
  Widget build(BuildContext context) {
    if (widget.standings.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      children: widget.standings.asMap().entries.map((entry) {
        final index = entry.key;
        final standing = entry.value;
        final isExpanded = _expandedCards[index] ?? false;

        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: _buildTeamCard(context, standing, index, isExpanded),
        );
      }).toList(),
    );
  }

  Widget _buildTeamCard(BuildContext context, TeamStanding standing, int index, bool isExpanded) {
    final teamColor = AppConstants.teamColors[standing.teamName] ?? AppConstants.primaryColorValue;

    return PremiumCard(
      glowColor: Color(teamColor),
      borderRadius: BorderRadius.circular(16),
      onTap: () {
        setState(() {
          _expandedCards[index] = !isExpanded;
        });
      },
      child: Column(
        children: [
          // Collapsed View
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Rank
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Color(teamColor),
                        Color(teamColor).withOpacity(0.7),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(
                    child: Text(
                      '${standing.rank}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),

                // Team Logo
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Color(teamColor),
                      width: 2,
                    ),
                  ),
                  child: ClipOval(
                    child: standing.teamLogo != null
                        ? Image.asset(
                            standing.teamLogo!,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                color: Colors.grey,
                                child: const Icon(
                                  Icons.sports_cricket,
                                  size: 30,
                                  color: Colors.white54,
                                ),
                              );
                            },
                          )
                        : Container(
                            color: Colors.grey,
                            child: const Icon(
                              Icons.sports_cricket,
                              size: 30,
                              color: Colors.white54,
                            ),
                          ),
                  ),
                ),
                const SizedBox(width: 12),

                // Team Name
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        standing.teamName,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        softWrap: true,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${standing.played} Matches',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.6),
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),

                // Points
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Color(teamColor),
                        Color(teamColor).withOpacity(0.7),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${standing.points}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // Expand Icon
                Icon(
                  isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                  color: Color(teamColor),
                ),
              ],
            ),
          ),

          // Expanded View
          if (isExpanded)
            _buildExpandedView(context, standing, teamColor)
                .animate()
                .fadeIn(duration: 300.ms)
                .slideY(begin: 0.2),
        ],
      ),
    ).animate().fadeIn(delay: (50 * index).ms).slideX(begin: -0.2);
  }

  Widget _buildExpandedView(BuildContext context, TeamStanding standing, int teamColor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(teamColor).withOpacity(0.1),
            Colors.transparent,
          ],
        ),
        border: Border(
          top: BorderSide(
            color: Color(teamColor).withOpacity(0.3),
            width: 1,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Statistics Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildStatItem('Won', standing.won.toString(), Colors.green),
              _buildStatItem('Lost', standing.lost.toString(), Colors.red),
              _buildStatItem('Drawn', standing.drawn.toString(), Colors.blue),
              _buildStatItem('Diff', standing.scoreDiff.toString(), Colors.orange),
            ],
          ),
          const SizedBox(height: 16),

          // Additional Stats
          if (standing.raidPoints != null || standing.tacklePoints != null)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                if (standing.raidPoints != null)
                  _buildStatItem('Raid Pts', standing.raidPoints.toString(), Colors.purple),
                if (standing.tacklePoints != null)
                  _buildStatItem('Tackle Pts', standing.tacklePoints.toString(), Colors.teal),
              ],
            ),
          const SizedBox(height: 16),

          // Team Details
          if (standing.coach != null || standing.captain != null || standing.ground != null)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (standing.coach != null)
                  _buildDetailRow(Icons.person, 'Coach', standing.coach!),
                if (standing.captain != null)
                  _buildDetailRow(Icons.star, 'Captain', standing.captain!),
                if (standing.ground != null)
                  _buildDetailRow(Icons.location_on, 'Ground', standing.ground!),
                const SizedBox(height: 12),
              ],
            ),

          // Description
          if (standing.description != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Text(
                standing.description!,
                style: TextStyle(
                  color: Colors.white.withOpacity(0.7),
                  fontSize: 13,
                ),
              ),
            ),

          // Action Buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => widget.onTeamTap?.call(standing),
                  icon: const Icon(Icons.info_outline, size: 18),
                  label: const Text('View Profile'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(teamColor),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => widget.onTeamTap?.call(standing),
                  icon: const Icon(Icons.emoji_events, size: 18),
                  label: const Text('Details'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Color(teamColor),
                    side: BorderSide(color: Color(teamColor)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(icon, size: 16, color: Colors.white54),
          const SizedBox(width: 8),
          Text(
            '$label: ',
            style: TextStyle(
              color: Colors.white.withOpacity(0.6),
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            color: color,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: Colors.white.withOpacity(0.6),
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}

class TeamStanding {
  final int rank;
  final String teamName;
  final String? teamLogo;
  final int played;
  final int won;
  final int lost;
  final int drawn;
  final int points;
  final int scoreDiff;
  final int? raidPoints;
  final int? tacklePoints;
  final String? coach;
  final String? captain;
  final String? ground;
  final String? description;

  TeamStanding({
    required this.rank,
    required this.teamName,
    this.teamLogo,
    required this.played,
    required this.won,
    required this.lost,
    required this.drawn,
    required this.points,
    required this.scoreDiff,
    this.raidPoints,
    this.tacklePoints,
    this.coach,
    this.captain,
    this.ground,
    this.description,
  });

  factory TeamStanding.fromJson(Map<String, dynamic> json) {
    return TeamStanding(
      rank: json['rank'] as int,
      teamName: json['teamName'] as String,
      teamLogo: json['teamLogo'] as String?,
      played: json['played'] as int,
      won: json['won'] as int,
      lost: json['lost'] as int,
      drawn: json['drawn'] as int,
      points: json['points'] as int,
      scoreDiff: json['scoreDiff'] as int,
      raidPoints: json['raidPoints'] as int?,
      tacklePoints: json['tacklePoints'] as int?,
      coach: json['coach'] as String?,
      captain: json['captain'] as String?,
      ground: json['ground'] as String?,
      description: json['description'] as String?,
    );
  }
}
