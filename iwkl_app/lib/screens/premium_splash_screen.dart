import 'package:flutter/material.dart';
import '../core/theme/app_design_system.dart';

class PremiumSplashScreen extends StatefulWidget {
  const PremiumSplashScreen({super.key});

  @override
  State<PremiumSplashScreen> createState() => _PremiumSplashScreenState();
}

class _PremiumSplashScreenState extends State<PremiumSplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _logoScale;
  late Animation<double> _logoOpacity;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _logoScale = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    _logoOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );

    _controller.forward();

    // Navigate to home after 2 seconds
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/home');
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo
                Transform.scale(
                  scale: _logoScale.value,
                  child: Opacity(
                    opacity: _logoOpacity.value,
                    child: Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [
                            AppDesignSystem.gold.withValues(alpha:0.2),
                            AppDesignSystem.softGold.withValues(alpha:0.1),
                            Colors.transparent,
                          ],
                        ),
                        border: Border.all(
                          color: AppDesignSystem.gold.withValues(alpha:0.5),
                          width: 2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppDesignSystem.gold.withValues(alpha:0.3),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ],
                      ),
                      child: Image.asset(
                        'assets/IWKL-FINAL-LOGO_2.png',
                        errorBuilder: (context, error, stackTrace) {
                          return const Icon(
                            Icons.sports_kabaddi,
                            size: 50,
                            color: AppDesignSystem.gold,
                          );
                        },
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                // App Title
                const Text(
                  'IWKL OFFICIAL APP',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 1,
                  ),
                ),
                const SizedBox(height: 10),
                // Subtitle
                const Text(
                  'Indian Women\'s Kabaddi League',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppDesignSystem.gold,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 30),
                // Loading Indicator
                const SizedBox(
                  width: 25,
                  height: 25,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      AppDesignSystem.gold,
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
