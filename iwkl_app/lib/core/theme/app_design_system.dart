import 'package:flutter/material.dart';

class AppDesignSystem {
  // Brand Colors (consistent across themes)
  static const Color primaryPurple = Color(0xFF8B2EFF);
  static const Color gradientPurple = Color(0xFFA43EFF);
  static const Color darkPurple = Color(0xFF5E149B);
  static const Color gold = Color(0xFFF8C23D);
  static const Color softGold = Color(0xFFD4A33C);
  static const Color white = Color(0xFFFFFFFF);

  // Dark Mode Colors
  static const Color darkPrimaryBackground = Color(0xFF14031E);
  static const Color darkCardBackground = Color(0xFF240833);
  static const Color darkSecondaryCard = Color(0xFF321048);
  static const Color darkSecondaryText = Color(0xFFC9C9C9);
  static const Color darkMutedText = Color(0xFF8F8F8F);
  static const Color darkDivider = Color(0x14FFFFFF);
  static const Color darkGlassEffect = Color(0x0DFFFFFF);

  // Light Mode Colors
  static const Color lightPrimaryBackground = Color(0xFFF5F0FA);
  static const Color lightCardBackground = Color(0xFFFFFFFF);
  static const Color lightSecondaryCard = Color(0xFFE8E0F0);
  static const Color lightSecondaryText = Color(0xFF6B5B7F);
  static const Color lightMutedText = Color(0xFF9A8DA8);
  static const Color lightDivider = Color(0x1A000000);
  static const Color lightGlassEffect = Color(0x0D000000);

  // Helper method to get theme-aware colors
  static Color getPrimaryBackground(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? darkPrimaryBackground
        : lightPrimaryBackground;
  }

  static Color getCardBackground(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? darkCardBackground
        : lightCardBackground;
  }

  static Color getSecondaryCard(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? darkSecondaryCard
        : lightSecondaryCard;
  }

  static Color getSecondaryText(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? darkSecondaryText
        : lightSecondaryText;
  }

  static Color getMutedText(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? darkMutedText
        : lightMutedText;
  }

  static Color getDivider(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? darkDivider
        : lightDivider;
  }

  static Color getGlassEffect(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? darkGlassEffect
        : lightGlassEffect;
  }

  static Color getPrimaryText(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Colors.white
        : Colors.black;
  }

  // Legacy color references (mapped to dark mode for backward compatibility)
  static const Color primaryBackground = darkPrimaryBackground;
  static const Color cardBackground = darkCardBackground;
  static const Color secondaryCard = darkSecondaryCard;
  static const Color secondaryText = darkSecondaryText;
  static const Color mutedText = darkMutedText;
  static const Color divider = darkDivider;
  static const Color glassEffect = darkGlassEffect;

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryPurple, gradientPurple],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient goldGradient = LinearGradient(
    colors: [gold, softGold],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient cardGradient = LinearGradient(
    colors: [cardBackground, secondaryCard],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient glassGradient = LinearGradient(
    colors: [glassEffect, Color(0x0AFFFFFF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Typography (theme-aware helper methods)
  static TextStyle getLargeBoldTitle(BuildContext context) {
    return TextStyle(
      fontSize: 28,
      fontWeight: FontWeight.bold,
      color: getPrimaryText(context),
      letterSpacing: -0.5,
    );
  }

  static TextStyle getMediumSectionTitle(BuildContext context) {
    return TextStyle(
      fontSize: 20,
      fontWeight: FontWeight.w600,
      color: getPrimaryText(context),
      letterSpacing: -0.3,
    );
  }

  static TextStyle getElegantSubtitle(BuildContext context) {
    return TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.w500,
      color: getSecondaryText(context),
      letterSpacing: -0.2,
    );
  }

  static TextStyle getReadableBody(BuildContext context) {
    return TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.w400,
      color: getPrimaryText(context),
      letterSpacing: 0,
      height: 1.5,
    );
  }

  static TextStyle getSoftGreyCaption(BuildContext context) {
    return TextStyle(
      fontSize: 12,
      fontWeight: FontWeight.w400,
      color: getMutedText(context),
      letterSpacing: 0,
    );
  }

  // Legacy text styles (dark mode only for backward compatibility)
  static const TextStyle largeBoldTitle = TextStyle(
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: white,
    letterSpacing: -0.5,
  );

  static const TextStyle mediumSectionTitle = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: white,
    letterSpacing: -0.3,
  );

  static const TextStyle elegantSubtitle = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w500,
    color: secondaryText,
    letterSpacing: -0.2,
  );

  static const TextStyle readableBody = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: white,
    letterSpacing: 0,
    height: 1.5,
  );

  static const TextStyle softGreyCaption = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w400,
    color: mutedText,
    letterSpacing: 0,
  );

  // Theme-aware card decoration helpers
  static BoxDecoration getPremiumCardDecoration(BuildContext context) {
    return BoxDecoration(
      gradient: LinearGradient(
        colors: [
          getCardBackground(context),
          getSecondaryCard(context),
        ],
      ),
      borderRadius: BorderRadius.circular(20),
      boxShadow: [
        BoxShadow(
          color: primaryPurple.withValues(alpha: 0.15),
          blurRadius: 20,
          offset: const Offset(0, 10),
        ),
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.3),
          blurRadius: 10,
          offset: const Offset(0, 5),
        ),
      ],
      border: Border.all(
        color: primaryPurple.withValues(alpha:0.2),
        width: 1,
      ),
    );
  }

  static BoxDecoration getGlassCardDecoration(BuildContext context) {
    return BoxDecoration(
      gradient: LinearGradient(
        colors: [
          getGlassEffect(context),
          getGlassEffect(context).withValues(alpha: 0.8),
        ],
      ),
      borderRadius: BorderRadius.circular(20),
      border: Border.all(
        color: getPrimaryText(context).withValues(alpha:0.08),
        width: 1,
      ),
    );
  }

  // Card Decoration (legacy, dark mode only)
  static BoxDecoration premiumCardDecoration = BoxDecoration(
    gradient: cardGradient,
    borderRadius: BorderRadius.circular(20),
    boxShadow: [
      BoxShadow(
        color: primaryPurple.withValues(alpha: 0.15),
        blurRadius: 20,
        offset: const Offset(0, 10),
      ),
      BoxShadow(
        color: Colors.black.withValues(alpha: 0.3),
        blurRadius: 10,
        offset: const Offset(0, 5),
      ),
    ],
    border: Border.all(
      color: primaryPurple.withValues(alpha:0.2),
      width: 1,
    ),
  );

  static BoxDecoration glassCardDecoration = BoxDecoration(
    gradient: glassGradient,
    borderRadius: BorderRadius.circular(20),
    border: Border.all(
      color: white.withValues(alpha:0.08),
      width: 1,
    ),
  );

  static BoxDecoration goldBorderDecoration = BoxDecoration(
    borderRadius: BorderRadius.circular(20),
    border: Border.all(
      color: gold.withValues(alpha:0.5),
      width: 1.5,
    ),
  );

  // Box Shadows
  static List<BoxShadow> premiumShadow = [
    BoxShadow(
      color: primaryPurple.withValues(alpha: 0.2),
      blurRadius: 30,
      offset: const Offset(0, 15),
    ),
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.4),
      blurRadius: 20,
      offset: const Offset(0, 10),
    ),
  ];

  static List<BoxShadow> softShadow = [
    BoxShadow(
      color: Colors.black.withValues(alpha:0.2),
      blurRadius: 15,
      offset: const Offset(0, 5),
    ),
  ];

  // Spacing
  static const double xsSpacing = 4.0;
  static const double smSpacing = 8.0;
  static const double mdSpacing = 16.0;
  static const double lgSpacing = 24.0;
  static const double xlSpacing = 32.0;
  static const double xxlSpacing = 48.0;

  // Border Radius
  static const double smRadius = 8.0;
  static const double mdRadius = 12.0;
  static const double lgRadius = 16.0;
  static const double xlRadius = 20.0;
  static const double xxlRadius = 28.0;
  static const double fullRadius = 999.0;

  // Animation Durations
  static const Duration fastAnimation = Duration(milliseconds: 200);
  static const Duration normalAnimation = Duration(milliseconds: 300);
  static const Duration slowAnimation = Duration(milliseconds: 500);
  static const Duration verySlowAnimation = Duration(milliseconds: 800);

  // Easing Curves
  static const Curve smoothCurve = Curves.easeInOutCubic;
  static const Curve bounceCurve = Curves.bounceOut;
  static const Curve elasticCurve = Curves.elasticOut;
}
