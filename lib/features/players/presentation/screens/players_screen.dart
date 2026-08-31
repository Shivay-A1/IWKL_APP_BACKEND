import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';

class PlayersScreen extends StatelessWidget {
  const PlayersScreen({super.key});

  final List<Map<String, dynamic>> _players = const [
    {
      'name': 'Rahul Kumar',
      'team': 'Gujarat Gems',
      'position': 'Raider',
      'raidPoints': 145,
      'tacklePoints': 12,
      'image': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    },
    {
      'name': 'Vikram Singh',
      'team': 'Maharashtra Mavericks',
      'position': 'Defender',
      'raidPoints': 45,
      'tacklePoints': 89,
      'image': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    },
    {
      'name': 'Amit Patel',
      'team': 'Punjab Panthers',
      'position': 'All-Rounder',
      'raidPoints': 98,
      'tacklePoints': 45,
      'image': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    },
    {
      'name': 'Suresh Kumar',
      'team': 'Delhi Daredevils',
      'position': 'Raider',
      'raidPoints': 132,
      'tacklePoints': 18,
      'image': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    },
    {
      'name': 'Prakash Sharma',
      'team': 'Karnataka Kings',
      'position': 'Defender',
      'raidPoints': 32,
      'tacklePoints': 95,
      'image': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
    },
    {
      'name': 'Deepak Yadav',
      'team': 'Tamil Nadu Titans',
      'position': 'All-Rounder',
      'raidPoints': 78,
      'tacklePoints': 52,
      'image': 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200',
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
          'Players',
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
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _players.length,
        itemBuilder: (context, index) {
          final player = _players[index];
          return _buildPlayerCard(player, index);
        },
      ),
    );
  }

  Widget _buildPlayerCard(Map<String, dynamic> player, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.05),
            Colors.white.withOpacity(0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF9333EA).withOpacity(0.3),
        ),
      ),
      child: Row(
        children: [
          // Player Image
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF4C085D).withOpacity(0.5),
                  const Color(0xFF6F1AB6).withOpacity(0.3),
                ],
              ),
            ),
            child: ClipOval(
              child: CachedNetworkImage(
                imageUrl: player['image'],
                fit: BoxFit.cover,
                placeholder: (context, url) => const Icon(Icons.person, size: 30, color: Colors.white54),
                errorWidget: (context, url, error) => const Icon(Icons.person, size: 30, color: Colors.white54),
                memCacheWidth: 200,
                memCacheHeight: 200,
              ),
            ),
          ),
          const SizedBox(width: 16),
          // Player Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  player['name'],
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${player['team']} • ${player['position']}',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.6),
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _buildStatBadge('Raid: ${player['raidPoints']}'),
                    const SizedBox(width: 8),
                    _buildStatBadge('Tackle: ${player['tacklePoints']}'),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms, delay: (index * 100).ms).slideX(begin: -0.1, end: 0);
  }

  Widget _buildStatBadge(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFF9333EA).withOpacity(0.2),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Color(0xFF9333EA),
          fontSize: 11,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
