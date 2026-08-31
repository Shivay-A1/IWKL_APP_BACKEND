import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/theme/app_design_system.dart';

class PremiumQuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color? iconColor;

  const PremiumQuickAction({
    super.key,
    required this.icon,
    required this.label,
    required this.onTap,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              gradient: AppDesignSystem.cardGradient,
              borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
              border: Border.all(
                color: AppDesignSystem.primaryPurple.withOpacity(0.3),
                width: 1,
              ),
              boxShadow: AppDesignSystem.softShadow,
            ),
            child: Icon(
              icon,
              color: iconColor ?? AppDesignSystem.primaryPurple,
              size: 28,
            ),
          ),
          const SizedBox(height: AppDesignSystem.smSpacing),
          Text(
            label,
            style: AppDesignSystem.softGreyCaption,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    ).animate().fadeIn(duration: AppDesignSystem.fastAnimation).scale(
      begin: const Offset(0.9, 0.9),
      end: const Offset(1, 1),
      curve: AppDesignSystem.smoothCurve,
    );
  }
}
