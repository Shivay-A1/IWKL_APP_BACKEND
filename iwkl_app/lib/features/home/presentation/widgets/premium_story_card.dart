import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/theme/app_design_system.dart';

class PremiumStoryCard extends StatelessWidget {
  final String title;
  final String? imageUrl;
  final VoidCallback? onTap;
  final bool isSeen;

  const PremiumStoryCard({
    super.key,
    required this.title,
    this.imageUrl,
    this.onTap,
    this.isSeen = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8),
        child: Column(
          children: [
            Container(
              width: 70,
              height: 70,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: isSeen
                    ? LinearGradient(
                        colors: [
                          AppDesignSystem.mutedText.withValues(alpha: 0.3),
                          AppDesignSystem.mutedText.withValues(alpha: 0.1),
                        ],
                      )
                    : AppDesignSystem.primaryGradient,
                border: Border.all(
                  color: AppDesignSystem.primaryPurple,
                  width: 2,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(3),
                child: Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppDesignSystem.cardBackground,
                  ),
                  child: ClipOval(
                    child: imageUrl != null && imageUrl!.isNotEmpty
                        ? Image.network(
                            imageUrl!,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                width: 64,
                                height: 64,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: AppDesignSystem.primaryGradient,
                                ),
                                child: const Icon(
                                  Icons.sports_kabaddi,
                                  size: 30,
                                  color: Colors.white,
                                ),
                              );
                            },
                          )
                        : Container(
                            width: 64,
                            height: 64,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: AppDesignSystem.primaryGradient,
                            ),
                            child: const Icon(
                              Icons.sports_kabaddi,
                              size: 30,
                              color: Colors.white,
                            ),
                          ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 6),
            SizedBox(
              width: 70,
              child: Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ).animate().fadeIn(duration: AppDesignSystem.fastAnimation).scale(
        begin: const Offset(0.9, 0.9),
        end: const Offset(1, 1),
        curve: AppDesignSystem.smoothCurve,
      ),
    );
  }
}
