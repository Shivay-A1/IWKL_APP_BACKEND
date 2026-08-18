import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:iwkl_app/core/constants/app_constants.dart';

class TeamsScreen extends StatelessWidget {
  const TeamsScreen({super.key});

  final List<Map<String, dynamic>> _teams = const [
    {
      'name': 'Gujarat Gems',
      'logo': 'assets/teams/gujarat_gems.png',
      'tagline': 'Rising to Glory',
      'color': Color(0xFF9333EA),
    },
    {
      'name': 'Maharashtra Mavericks',
      'logo': 'assets/teams/maharashtra_mavericks.png',
      'tagline': 'Unstoppable Force',
      'color': Color(0xFFEC4899),
    },
    {
      'name': 'Punjab Panthers',
      'logo': 'assets/teams/punjab_panthers.png',
      'tagline': 'Roaring to Win',
      'color': Color(0xFF4C085D),
    },
    {
      'name': 'Delhi Daredevils',
      'logo': 'assets/teams/delhi_daredevils.png',
      'tagline': 'Fearless Fighters',
      'color': Color(0xFF9333EA),
    },
    {
      'name': 'Karnataka Kings',
      'logo': 'assets/teams/karnataka_kings.png',
      'tagline': 'Royal Pride',
      'color': Color(0xFFEC4899),
    },
    {
      'name': 'Tamil Nadu Titans',
      'logo': 'assets/teams/tamil_nadu_titans.png',
      'tagline': 'Mighty Warriors',
      'color': Color(0xFF4C085D),
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: const Text(
          'Teams',
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
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.8,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: _teams.length,
        itemBuilder: (context, index) {
          final team = _teams[index];
          return _buildTeamCard(team, index);
        },
      ),
    );
  }

  Widget _buildTeamCard(Map<String, dynamic> team, int index) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.05),
            Colors.white.withOpacity(0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: (team['color'] as Color).withOpacity(0.3),
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [
                  (team['color'] as Color).withOpacity(0.3),
                  (team['color'] as Color).withOpacity(0.1),
                ],
              ),
            ),
            child: const Icon(
              Icons.sports_kabaddi,
              size: 40,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            team['name'],
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            team['tagline'],
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 12,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms, delay: (index * 100).ms).scale(begin: const Offset(0.9, 0.9));
  }
}
