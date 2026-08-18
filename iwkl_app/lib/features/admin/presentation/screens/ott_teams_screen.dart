import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class OTTTeamsScreen extends StatelessWidget {
  const OTTTeamsScreen({super.key});

  final List<Map<String, dynamic>> _teams = const [
    {
      'name': 'Gujarat Gems',
      'logo': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100',
      'tagline': 'Shining Bright',
    },
    {
      'name': 'Maharashtra Mavericks',
      'logo': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100',
      'tagline': 'Unstoppable Force',
    },
    {
      'name': 'Punjab Panthers',
      'logo': 'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?w=100',
      'tagline': 'Rising High',
    },
    {
      'name': 'Delhi Daredevils',
      'logo': 'https://images.unsplash.com/photo-1596554206586-8b89673e073e?w=100',
      'tagline': 'Fearless Warriors',
    },
    {
      'name': 'Karnataka Kings',
      'logo': 'https://images.unsplash.com/photo-1552674605-46d536000ef6?w=100',
      'tagline': 'Royal Pride',
    },
    {
      'name': 'Tamil Nadu Titans',
      'logo': 'https://images.unsplash.com/photo-1579952363873-27f3bde9be76?w=100',
      'tagline': 'Mighty Titans',
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
          'OTT Teams',
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
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GridView.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
            childAspectRatio: 0.8,
          ),
          itemCount: _teams.length,
          itemBuilder: (context, index) {
            final team = _teams[index];
            return _buildTeamCard(team, index);
          },
        ),
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
          color: const Color(0xFF9333EA).withOpacity(0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Logo
          Expanded(
            flex: 2,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    const Color(0xFF4C085D).withOpacity(0.5),
                    const Color(0xFF6F1AB6).withOpacity(0.3),
                  ],
                ),
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                ),
              ),
              child: Center(
                child: Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white.withOpacity(0.1),
                  ),
                  child: const Icon(
                    Icons.groups,
                    size: 30,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
          // Content
          Expanded(
            flex: 3,
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    team['name'],
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    team['tagline'],
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.6),
                      fontSize: 11,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  // Manage Button
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF9333EA),
                      minimumSize: const Size(double.infinity, 32),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      'Manage',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: _buildActionButton(Icons.open_in_new, 'Open', () {}),
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: _buildActionButton(Icons.edit, 'Edit', () {}),
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: _buildActionButton(Icons.delete, 'Delete', () {}),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  // Additional Actions
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildSmallActionButton(Icons.live_tv, 'Live Match'),
                        const SizedBox(width: 4),
                        _buildSmallActionButton(Icons.star, 'Highlights'),
                        const SizedBox(width: 4),
                        _buildSmallActionButton(Icons.video_library, 'Videos'),
                        const SizedBox(width: 4),
                        _buildSmallActionButton(Icons.bar_chart, 'Statistics'),
                        const SizedBox(width: 4),
                        _buildSmallActionButton(Icons.collections, 'Media'),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms, delay: (index * 100).ms).scale(begin: const Offset(0.9, 0.9));
  }

  Widget _buildActionButton(IconData icon, String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(6),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.1),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Column(
          children: [
            Icon(icon, size: 14, color: const Color(0xFF9333EA)),
            const SizedBox(height: 2),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 9,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSmallActionButton(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFF9333EA).withOpacity(0.2),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: const Color(0xFF9333EA)),
          const SizedBox(width: 4),
          Text(
            label,
            style: const TextStyle(
              color: Color(0xFF9333EA),
              fontSize: 9,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
