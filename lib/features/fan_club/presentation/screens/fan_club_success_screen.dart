import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class FanClubSuccessScreen extends StatelessWidget {
  final String teamName;
  final String teamLogo;

  const FanClubSuccessScreen({
    super.key,
    required this.teamName,
    required this.teamLogo,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Success Icon
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF9333EA), Color(0xFFEC4899)],
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check,
                    size: 60,
                    color: Colors.white,
                  ),
                ).animate().scale(duration: 600.ms, curve: Curves.elasticOut),
                
                const SizedBox(height: 32),
                
                // Success Message
                const Text(
                  'Welcome to the\nIWKL Fan Club!',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    height: 1.2,
                  ),
                  textAlign: TextAlign.center,
                ).animate().fadeIn(duration: 400.ms, delay: 200.ms),
                
                const SizedBox(height: 16),
                
                // Subtitle
                Text(
                  'You are now a proud supporter of',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.7),
                    fontSize: 16,
                  ),
                ).animate().fadeIn(duration: 400.ms, delay: 300.ms),
                
                const SizedBox(height: 24),
                
                // Team Logo
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: const Color(0xFF9333EA).withOpacity(0.5),
                      width: 2,
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.asset(
                      teamLogo,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return const Icon(
                          Icons.sports_kabaddi,
                          color: Color(0xFF9333EA),
                          size: 40,
                        );
                      },
                    ),
                  ),
                ).animate().scale(duration: 400.ms, delay: 400.ms),
                
                const SizedBox(height: 16),
                
                // Team Name
                Text(
                  teamName,
                  style: const TextStyle(
                    color: Color(0xFF9333EA),
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ).animate().fadeIn(duration: 400.ms, delay: 500.ms),
                
                const SizedBox(height: 48),
                
                // Continue Button
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF9333EA), Color(0xFFEC4899)],
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.popUntil(context, (route) => route.isFirst);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 0,
                      ),
                      child: const Text(
                        'CONTINUE',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                  ),
                ).animate().fadeIn(duration: 400.ms, delay: 600.ms),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
