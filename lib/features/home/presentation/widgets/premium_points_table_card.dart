import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/theme/app_design_system.dart';

class PremiumPointsTableCard extends StatelessWidget {
  final String teamName;
  final String teamLogo;
  final int played;
  final int won;
  final int lost;
  final int points;
  final String nrr;
  final int position;
  final VoidCallback? onTap;

  const PremiumPointsTableCard({
    super.key,
    required this.teamName,
    required this.teamLogo,
    required this.played,
    required this.won,
    required this.lost,
    required this.points,
    required this.nrr,
    required this.position,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        padding: const EdgeInsets.all(AppDesignSystem.mdSpacing),
        decoration: AppDesignSystem.premiumCardDecoration,
        child: Row(
          children: [
            // Position
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: position <= 2
                    ? AppDesignSystem.goldGradient
                    : position <= 4
                        ? AppDesignSystem.primaryGradient
                        : null,
                color: position > 4 ? AppDesignSystem.cardBackground : null,
                border: Border.all(
                  color: position <= 4 ? Colors.transparent : AppDesignSystem.mutedText.withOpacity(0.3),
                  width: 1,
                ),
              ),
              child: Center(
                child: Text(
                  position.toString(),
                  style: TextStyle(
                    color: position <= 4 ? Colors.black : AppDesignSystem.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
            const SizedBox(width: AppDesignSystem.mdSpacing),
            // Team Logo
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppDesignSystem.cardBackground,
                border: Border.all(
                  color: AppDesignSystem.primaryPurple.withOpacity(0.3),
                  width: 1,
                ),
              ),
              child: ClipOval(
                child: Image.network(
                  teamLogo,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return const Icon(
                      Icons.sports_kabaddi,
                      size: 24,
                      color: AppDesignSystem.mutedText,
                    );
                  },
                ),
              ),
            ),
            const SizedBox(width: AppDesignSystem.mdSpacing),
            // Team Name
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    teamName,
                    style: AppDesignSystem.readableBody,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'NRR: $nrr',
                    style: AppDesignSystem.softGreyCaption,
                  ),
                ],
              ),
            ),
            // Stats
            Row(
              children: [
                _buildStat('P', played),
                const SizedBox(width: AppDesignSystem.mdSpacing),
                _buildStat('W', won),
                const SizedBox(width: AppDesignSystem.mdSpacing),
                _buildStat('L', lost),
                const SizedBox(width: AppDesignSystem.mdSpacing),
                _buildStat('Pts', points, isPoints: true),
              ],
            ),
          ],
        ),
      ),
    ).animate().fadeIn(duration: AppDesignSystem.fastAnimation).slideX(
      begin: 0.2,
      end: 0,
      curve: AppDesignSystem.smoothCurve,
    );
  }

  Widget _buildStat(String label, int value, {bool isPoints = false}) {
    return Column(
      children: [
        Text(
          value.toString(),
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: isPoints ? AppDesignSystem.gold : Colors.white,
          ),
        ),
        Text(
          label,
          style: AppDesignSystem.softGreyCaption,
        ),
      ],
    );
  }
}
