import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/constants/app_constants.dart';

class TeamSelectionWidget extends StatelessWidget {
  final String? selectedTeam;
  final Function(String) onTeamSelected;

  const TeamSelectionWidget({
    super.key,
    required this.selectedTeam,
    required this.onTeamSelected,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 0.8,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: AppConstants.allTeams.length,
      itemBuilder: (context, index) {
        final teamName = AppConstants.allTeams[index];
        final isSelected = selectedTeam == teamName;
        final teamColor = AppConstants.teamColors[teamName] ?? 0xFF9333EA;
        final teamLogo = AppConstants.teamLogos[teamName] ?? '';

        return _buildTeamCard(
          teamName: teamName,
          teamLogo: teamLogo,
          teamColor: Color(teamColor),
          isSelected: isSelected,
          onTap: () => onTeamSelected(teamName),
          index: index,
        );
      },
    );
  }

  Widget _buildTeamCard({
    required String teamName,
    required String teamLogo,
    required Color teamColor,
    required bool isSelected,
    required VoidCallback onTap,
    required int index,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          gradient: isSelected
              ? LinearGradient(
                  colors: [
                    teamColor.withOpacity(0.6),
                    teamColor.withOpacity(0.3),
                  ],
                )
              : LinearGradient(
                  colors: [
                    Colors.white.withOpacity(0.05),
                    Colors.white.withOpacity(0.02),
                  ],
                ),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? teamColor : Colors.white.withOpacity(0.1),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Team Logo
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.asset(
                  teamLogo,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Icon(
                      Icons.sports_kabaddi,
                      color: teamColor,
                      size: 30,
                    );
                  },
                ),
              ),
            ),
            const SizedBox(height: 8),
            // Team Name
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: Text(
                teamName,
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.white70,
                  fontSize: 11,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            // Selection Indicator
            if (isSelected)
              Icon(
                Icons.check_circle,
                color: teamColor,
                size: 16,
              ),
          ],
        ),
      ).animate().fadeIn(duration: 200.ms, delay: (index * 30).ms),
    );
  }
}
