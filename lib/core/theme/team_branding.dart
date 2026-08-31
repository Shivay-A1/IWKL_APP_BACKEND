import 'package:flutter/material.dart';
import 'app_design_system.dart';
import '../../../core/constants/app_constants.dart';

class TeamBranding {
  final String teamName;
  final Color primaryColor;
  final Color secondaryColor;
  final Color accentColor;
  final LinearGradient gradient;
  final Color glowColor;

  TeamBranding({
    required this.teamName,
    required this.primaryColor,
    required this.secondaryColor,
    required this.accentColor,
    required this.gradient,
    required this.glowColor,
  });

  static TeamBranding getBranding(String teamName) {
    final teamColors = AppConstants.teamColors;
    final teamSecondaryColors = AppConstants.teamSecondaryColors;
    final teamGradients = AppConstants.teamGradients;
    final teamGlowColors = AppConstants.teamGlowColors;

    final primaryColorValue = teamColors[teamName] ?? AppDesignSystem.primaryPurple.value;
    final secondaryColorValue = teamSecondaryColors[teamName] ?? AppDesignSystem.gradientPurple.value;
    final gradientColors = teamGradients[teamName] ?? [AppDesignSystem.primaryPurple.value, AppDesignSystem.gradientPurple.value];
    final glowColorValue = teamGlowColors[teamName] ?? AppDesignSystem.primaryPurple.value;

    return TeamBranding(
      teamName: teamName,
      primaryColor: Color(primaryColorValue),
      secondaryColor: Color(secondaryColorValue),
      accentColor: AppDesignSystem.gold,
      gradient: LinearGradient(
        colors: gradientColors.map((c) => Color(c)).toList(),
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      glowColor: Color(glowColorValue),
    );
  }

  static BoxDecoration getTeamCardDecoration(String teamName) {
    final branding = getBranding(teamName);
    return BoxDecoration(
      gradient: branding.gradient,
      borderRadius: BorderRadius.circular(AppDesignSystem.xlRadius),
      boxShadow: [
        BoxShadow(
          color: branding.glowColor.withOpacity(0.3),
          blurRadius: 20,
          offset: const Offset(0, 10),
        ),
        BoxShadow(
          color: Colors.black.withOpacity(0.3),
          blurRadius: 10,
          offset: const Offset(0, 5),
        ),
      ],
      border: Border.all(
        color: branding.primaryColor.withOpacity(0.3),
        width: 1,
      ),
    );
  }

  static BoxDecoration getTeamGlassDecoration(String teamName) {
    final branding = getBranding(teamName);
    return BoxDecoration(
      gradient: LinearGradient(
        colors: [
          branding.primaryColor.withOpacity(0.1),
          branding.secondaryColor.withOpacity(0.05),
        ],
      ),
      borderRadius: BorderRadius.circular(AppDesignSystem.xlRadius),
      border: Border.all(
        color: branding.primaryColor.withOpacity(0.2),
        width: 1,
      ),
    );
  }

  static TextStyle getTeamTitleStyle(String teamName) {
    final branding = getBranding(teamName);
    return TextStyle(
      color: Colors.white,
      fontSize: 24,
      fontWeight: FontWeight.bold,
      shadows: [
        Shadow(
          color: branding.primaryColor.withOpacity(0.5),
          blurRadius: 10,
        ),
      ],
    );
  }

  static BoxDecoration getTeamButtonDecoration(String teamName) {
    final branding = getBranding(teamName);
    return BoxDecoration(
      gradient: branding.gradient,
      borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
      boxShadow: [
        BoxShadow(
          color: branding.glowColor.withOpacity(0.4),
          blurRadius: 15,
          offset: const Offset(0, 5),
        ),
      ],
    );
  }
}
