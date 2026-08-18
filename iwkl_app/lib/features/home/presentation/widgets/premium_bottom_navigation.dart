import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/theme/app_design_system.dart';

class PremiumBottomNavigation extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const PremiumBottomNavigation({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        gradient: AppDesignSystem.cardGradient,
        borderRadius: BorderRadius.circular(30),
        border: Border.all(
          color: AppDesignSystem.primaryPurple.withOpacity(0.3),
          width: 1,
        ),
        boxShadow: AppDesignSystem.premiumShadow,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(
            icon: Icons.home,
            label: 'Home',
            index: 0,
            isSelected: currentIndex == 0,
          ),
          _buildNavItem(
            icon: Icons.play_circle,
            label: 'Live',
            index: 1,
            isSelected: currentIndex == 1,
          ),
          _buildNavItem(
            icon: Icons.play_arrow,
            label: 'OTT',
            index: 2,
            isSelected: currentIndex == 2,
          ),
          _buildNavItem(
            icon: Icons.groups,
            label: 'Teams',
            index: 3,
            isSelected: currentIndex == 3,
          ),
          _buildNavItem(
            icon: Icons.person,
            label: 'Profile',
            index: 4,
            isSelected: currentIndex == 4,
          ),
        ],
      ),
    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideY(
      begin: 0.3,
      end: 0,
      curve: AppDesignSystem.smoothCurve,
    );
  }

  Widget _buildNavItem({
    required IconData icon,
    required String label,
    required int index,
    required bool isSelected,
  }) {
    return GestureDetector(
      onTap: () => onTap(index),
      child: AnimatedContainer(
        duration: AppDesignSystem.fastAnimation,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          gradient: isSelected ? AppDesignSystem.primaryGradient : null,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 24,
              color: isSelected ? Colors.white : AppDesignSystem.mutedText,
            ),
            if (isSelected) ...[
              const SizedBox(width: 8),
              Text(
                label,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
