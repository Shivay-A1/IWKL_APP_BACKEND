import 'package:flutter/material.dart';
import '../../../../core/theme/app_design_system.dart';

class PremiumLiveMatchCard extends StatelessWidget {
  final String team1Name;
  final String team2Name;
  final String? team1Logo;
  final String? team2Logo;
  final int team1Score;
  final int team2Score;
  final String venue;
  final String matchTime;
  final VoidCallback? onWatch;

  const PremiumLiveMatchCard({
    super.key,
    required this.team1Name,
    required this.team2Name,
    this.team1Logo,
    this.team2Logo,
    required this.team1Score,
    required this.team2Score,
    required this.venue,
    required this.matchTime,
    this.onWatch,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 220,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppDesignSystem.getCardBackground(context),
            AppDesignSystem.getSecondaryCard(context),
          ],
        ),
        borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
        border: Border.all(
          color: AppDesignSystem.primaryPurple.withValues(alpha: 0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: AppDesignSystem.primaryPurple.withValues(alpha: 0.3),
            blurRadius: 15,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header with date and LIVE badge
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  matchTime,
                  style: TextStyle(
                    color: AppDesignSystem.getSecondaryText(context),
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Colors.red, Colors.redAccent],
                        ),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text(
                        'LIVE',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                    const SizedBox(width: 5),
                    const Icon(
                      Icons.circle,
                      size: 8,
                      color: Colors.red,
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),
            // Teams row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Team 1
                Expanded(
                  child: Column(
                    children: [
                      Container(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppDesignSystem.getCardBackground(context),
                          border: Border.all(
                            color: AppDesignSystem.gold.withValues(alpha: 0.6),
                            width: 2,
                          ),
                        ),
                        child: ClipOval(
                          child: team1Logo != null && team1Logo!.isNotEmpty
                              ? Image.asset(
                                  team1Logo!,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Icon(Icons.sports_kabaddi, color: AppDesignSystem.getPrimaryText(context), size: 28);
                                  },
                                )
                              : Icon(Icons.sports_kabaddi, color: AppDesignSystem.getPrimaryText(context), size: 28),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        team1Name,
                        style: TextStyle(
                          color: AppDesignSystem.getPrimaryText(context),
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        team1Score.toString(),
                        style: TextStyle(
                          color: AppDesignSystem.getPrimaryText(context),
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                // VS
                Column(
                  children: [
                    Text(
                      'VS',
                      style: TextStyle(
                        color: AppDesignSystem.getSecondaryText(context),
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        gradient: AppDesignSystem.goldGradient,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text(
                        'Q3',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                // Team 2
                Expanded(
                  child: Column(
                    children: [
                      Container(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppDesignSystem.getCardBackground(context),
                          border: Border.all(
                            color: AppDesignSystem.gold.withValues(alpha: 0.6),
                            width: 2,
                          ),
                        ),
                        child: ClipOval(
                          child: team2Logo != null && team2Logo!.isNotEmpty
                              ? Image.asset(
                                  team2Logo!,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Icon(Icons.sports_kabaddi, color: AppDesignSystem.getPrimaryText(context), size: 28);
                                  },
                                )
                              : Icon(Icons.sports_kabaddi, color: AppDesignSystem.getPrimaryText(context), size: 18),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        team2Name,
                        style: TextStyle(
                          color: AppDesignSystem.getPrimaryText(context),
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        team2Score.toString(),
                        style: TextStyle(
                          color: AppDesignSystem.getPrimaryText(context),
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            // Venue
            Row(
              children: [
                Icon(
                  Icons.location_on,
                  color: AppDesignSystem.getSecondaryText(context),
                  size: 14,
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    venue,
                    style: TextStyle(
                      color: AppDesignSystem.getSecondaryText(context),
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}