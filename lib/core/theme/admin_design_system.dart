import 'package:flutter/material.dart';

class AdminDesignSystem {
  // Professional Admin Colors - Different from public app
  static const Color adminBackground = Color(0xFF0A0E27);
  static const Color adminSidebar = Color(0xFF0F152B);
  static const Color adminCard = Color(0xFF1A1F3A);
  static const Color adminPrimary = Color(0xFF3B82F6);
  static const Color adminSecondary = Color(0xFF6366F1);
  static const Color adminSuccess = Color(0xFF10B981);
  static const Color adminWarning = Color(0xFFF59E0B);
  static const Color adminError = Color(0xFFEF4444);
  static const Color adminText = Color(0xFFE2E8F0);
  static const Color adminMuted = Color(0xFF94A3B8);
  static const Color adminBorder = Color(0xFF334155);

  // Admin Gradients
  static const LinearGradient adminGradient = LinearGradient(
    colors: [adminPrimary, adminSecondary],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient successGradient = LinearGradient(
    colors: [adminSuccess, Color(0xFF059669)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Admin Typography
  static const TextStyle adminTitle = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: adminText,
    letterSpacing: -0.5,
  );

  static const TextStyle adminSubtitle = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: adminText,
  );

  static const TextStyle adminBody = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    color: adminText,
  );

  static const TextStyle adminCaption = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.normal,
    color: adminMuted,
  );

  // Admin Card Decoration
  static BoxDecoration adminCardDecoration = BoxDecoration(
    color: adminCard,
    borderRadius: BorderRadius.circular(12),
    border: Border.all(color: adminBorder, width: 1),
  );

  static BoxDecoration adminGradientDecoration = BoxDecoration(
    gradient: adminGradient,
    borderRadius: BorderRadius.circular(12),
  );

  // Admin Shadows
  static List<BoxShadow> adminShadow = [
    BoxShadow(
      color: Colors.black.withValues(alpha:0.3),
      blurRadius: 10,
      offset: const Offset(0, 4),
    ),
  ];

  // Admin Spacing
  static const double adminSm = 8.0;
  static const double adminMd = 16.0;
  static const double adminLg = 24.0;
  static const double adminXl = 32.0;

  // Admin Border Radius
  static const double adminRadius = 12.0;
  static const double adminRadiusLg = 16.0;
}
