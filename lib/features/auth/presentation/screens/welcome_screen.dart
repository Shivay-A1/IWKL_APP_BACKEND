import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../../core/theme/theme_provider.dart';

class WelcomeScreen extends StatelessWidget {
  final String firstName;

  const WelcomeScreen({
    super.key,
    required this.firstName,
  });

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDarkMode = themeProvider.isDarkMode;

    return Scaffold(
      backgroundColor: isDarkMode ? AppDesignSystem.primaryBackground : Colors.grey[100],
      body: SafeArea(
        child: Container(
          decoration: BoxDecoration(
            gradient: isDarkMode
                ? const LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [AppDesignSystem.primaryBackground, Color(0xFF0A0510)],
                  )
                : null,
          ),
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(AppDesignSystem.xlSpacing),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Logo
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: RadialGradient(
                        colors: [
                          AppDesignSystem.gold.withOpacity(0.3),
                          AppDesignSystem.softGold.withOpacity(0.1),
                          Colors.transparent,
                        ],
                      ),
                      border: Border.all(
                        color: AppDesignSystem.gold.withOpacity(0.5),
                        width: 2,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppDesignSystem.gold.withOpacity(0.3),
                          blurRadius: 30,
                          spreadRadius: 10,
                        ),
                      ],
                    ),
                    child: Image.asset(
                      'assets/IWKL-FINAL-LOGO_2.png',
                      errorBuilder: (context, error, stackTrace) {
                        return const Icon(
                          Icons.sports_kabaddi,
                          size: 60,
                          color: AppDesignSystem.gold,
                        );
                      },
                    ),
                  ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).scale(
                    begin: const Offset(0.8, 0.8),
                    end: const Offset(1, 1),
                    curve: AppDesignSystem.elasticCurve,
                  ),
                  const SizedBox(height: AppDesignSystem.xlSpacing),

                  // Welcome Message
                  const Text(
                    'Welcome',
                    style: AppDesignSystem.largeBoldTitle,
                  ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                  const SizedBox(height: AppDesignSystem.smSpacing),

                  Text(
                    firstName,
                    style: AppDesignSystem.elegantSubtitle.copyWith(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: AppDesignSystem.gold,
                    ),
                  ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideY(
                    begin: 0.3,
                    end: 0,
                    curve: AppDesignSystem.smoothCurve,
                  ),
                  const SizedBox(height: AppDesignSystem.xlSpacing * 2),

                  // Continue Button
                  PremiumButton(
                    text: 'Continue to Home',
                    onPressed: () => Navigator.pushReplacementNamed(context, '/home'),
                    isGold: true,
                  ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).scale(
                    begin: const Offset(0.95, 0.95),
                    end: const Offset(1, 1),
                    curve: AppDesignSystem.elasticCurve,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
