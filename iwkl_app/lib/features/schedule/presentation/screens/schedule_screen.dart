import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class ScheduleScreen extends StatelessWidget {
  const ScheduleScreen({super.key});

  final List<Map<String, dynamic>> _matches = const [
    {
      'team1': 'Gujarat Gems',
      'team2': 'Maharashtra Mavericks',
      'date': 'Aug 10, 2026',
      'time': '7:00 PM',
      'venue': 'Mumbai Arena',
      'status': 'Upcoming',
    },
    {
      'team1': 'Punjab Panthers',
      'team2': 'Delhi Daredevils',
      'date': 'Aug 11, 2026',
      'time': '8:00 PM',
      'venue': 'Delhi Stadium',
      'status': 'Upcoming',
    },
    {
      'team1': 'Karnataka Kings',
      'team2': 'Tamil Nadu Titans',
      'date': 'Aug 12, 2026',
      'time': '7:30 PM',
      'venue': 'Bangalore Arena',
      'status': 'Upcoming',
    },
    {
      'team1': 'Gujarat Gems',
      'team2': 'Punjab Panthers',
      'date': 'Aug 13, 2026',
      'time': '9:00 PM',
      'venue': 'Ahmedabad Stadium',
      'status': 'Upcoming',
    },
    {
      'team1': 'Maharashtra Mavericks',
      'team2': 'Karnataka Kings',
      'date': 'Aug 14, 2026',
      'time': '7:00 PM',
      'venue': 'Pune Arena',
      'status': 'Upcoming',
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
          'Schedule',
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
        itemCount: _matches.length,
        itemBuilder: (context, index) {
          final match = _matches[index];
          return _buildMatchCard(match, index);
        },
      ),
    );
  }

  Widget _buildMatchCard(Map<String, dynamic> match, int index) {
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Date and Time
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFF9333EA),
                      Color(0xFFEC4899),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  match['status'],
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Text(
                '${match['date']} • ${match['time']}',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.6),
                  fontSize: 12,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Teams
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  children: [
                    const Icon(
                      Icons.sports_kabaddi,
                      size: 40,
                      color: Color(0xFF9333EA),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      match['team1'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFF9333EA).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'VS',
                  style: TextStyle(
                    color: Color(0xFF9333EA),
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Expanded(
                child: Column(
                  children: [
                    const Icon(
                      Icons.sports_kabaddi,
                      size: 40,
                      color: Color(0xFFEC4899),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      match['team2'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Venue
          Row(
            children: [
              const Icon(
                Icons.location_on,
                size: 16,
                color: Color(0xFF9333EA),
              ),
              const SizedBox(width: 4),
              Text(
                match['venue'],
                style: TextStyle(
                  color: Colors.white.withOpacity(0.6),
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms, delay: (index * 100).ms).slideY(begin: 0.1, end: 0);
  }
}
