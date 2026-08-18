import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class FanClubScreen extends StatelessWidget {
  const FanClubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: const Text(
          'Fan Club',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Fan Club Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF4C085D),
                  const Color(0xFF9333EA),
                  const Color(0xFFEC4899).withOpacity(0.3),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                const Icon(
                  Icons.emoji_events,
                  size: 60,
                  color: Colors.white,
                ),
                const SizedBox(height: 12),
                const Text(
                  'Welcome to the Fan Club',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Support your favorite team and connect with fans',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.7),
                    fontSize: 14,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ).animate().fadeIn(duration: 300.ms).scale(begin: const Offset(0.9, 0.9)),
          const SizedBox(height: 24),
          
          // Support Team
          _buildSectionTitle('Support Team'),
          const SizedBox(height: 12),
          _buildFanClubCard(
            icon: Icons.favorite,
            title: 'Support Your Team',
            subtitle: 'Cheer for your favorite team',
            color: const Color(0xFF9333EA),
            onTap: () {
              // Navigate to team support
            },
          ),
          const SizedBox(height: 16),
          
          // Membership
          _buildSectionTitle('Membership'),
          const SizedBox(height: 12),
          _buildFanClubCard(
            icon: Icons.card_membership,
            title: 'Fan Membership',
            subtitle: 'Get exclusive fan benefits',
            color: const Color(0xFFEC4899),
            onTap: () {
              // Navigate to membership
            },
          ),
          const SizedBox(height: 16),
          
          // Leaderboard
          _buildSectionTitle('Leaderboard'),
          const SizedBox(height: 12),
          _buildFanClubCard(
            icon: Icons.leaderboard,
            title: 'Fan Leaderboard',
            subtitle: 'Top fans of the season',
            color: const Color(0xFF4C085D),
            onTap: () {
              // Navigate to leaderboard
            },
          ),
          const SizedBox(height: 16),
          
          // Certificates
          _buildSectionTitle('Achievements'),
          const SizedBox(height: 12),
          _buildFanClubCard(
            icon: Icons.verified,
            title: 'Fan Certificates',
            subtitle: 'Your fan achievements',
            color: const Color(0xFF9333EA),
            onTap: () {
              // Navigate to certificates
            },
          ),
          const SizedBox(height: 16),
          
          // Rewards
          _buildFanClubCard(
            icon: Icons.redeem,
            title: 'Fan Rewards',
            subtitle: 'Redeem your fan points',
            color: const Color(0xFFEC4899),
            onTap: () {
              // Navigate to rewards
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4),
      child: Text(
        title,
        style: const TextStyle(
          color: Color(0xFF9333EA),
          fontSize: 16,
          fontWeight: FontWeight.bold,
          letterSpacing: 1,
        ),
      ),
    );
  }

  Widget _buildFanClubCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.05),
            Colors.white.withOpacity(0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withOpacity(0.3),
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          splashColor: color.withOpacity(0.2),
          highlightColor: color.withOpacity(0.1),
          child: ListTile(
            leading: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    color.withOpacity(0.2),
                    color.withOpacity(0.1),
                  ],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: color,
                size: 24,
              ),
            ),
            title: Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            subtitle: Text(
              subtitle,
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 13,
              ),
            ),
            trailing: Icon(
              Icons.chevron_right,
              color: color.withOpacity(0.5),
            ),
          ),
        ),
      ),
    ).animate().fadeIn(duration: 200.ms).slideX(begin: -0.1, end: 0);
  }
}
