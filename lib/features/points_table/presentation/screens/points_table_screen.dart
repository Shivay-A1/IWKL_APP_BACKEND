import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:iwkl_app/core/constants/app_constants.dart';

class PointsTableScreen extends StatefulWidget {
  const PointsTableScreen({super.key});

  @override
  State<PointsTableScreen> createState() => _PointsTableScreenState();
}

class _PointsTableScreenState extends State<PointsTableScreen> {
  final List<Map<String, dynamic>> _teams = [
    {
      'position': 1,
      'name': 'Gujarat Gems',
      'played': 10,
      'won': 8,
      'lost': 2,
      'points': 32,
      'raidPoints': 145,
      'tacklePoints': 98,
      'form': ['W', 'W', 'L', 'W', 'W'],
    },
    {
      'position': 2,
      'name': 'Maharashtra Mavericks',
      'played': 10,
      'won': 7,
      'lost': 3,
      'points': 28,
      'raidPoints': 132,
      'tacklePoints': 89,
      'form': ['W', 'L', 'W', 'W', 'L'],
    },
    {
      'position': 3,
      'name': 'Punjab Panthers',
      'played': 10,
      'won': 6,
      'lost': 4,
      'points': 24,
      'raidPoints': 128,
      'tacklePoints': 85,
      'form': ['L', 'W', 'W', 'L', 'W'],
    },
    {
      'position': 4,
      'name': 'Delhi Daredevils',
      'played': 10,
      'won': 5,
      'lost': 5,
      'points': 20,
      'raidPoints': 115,
      'tacklePoints': 78,
      'form': ['W', 'L', 'L', 'W', 'W'],
    },
    {
      'position': 5,
      'name': 'Karnataka Kings',
      'played': 10,
      'won': 4,
      'lost': 6,
      'points': 16,
      'raidPoints': 108,
      'tacklePoints': 72,
      'form': ['L', 'L', 'W', 'L', 'W'],
    },
    {
      'position': 6,
      'name': 'Tamil Nadu Titans',
      'played': 10,
      'won': 3,
      'lost': 7,
      'points': 12,
      'raidPoints': 95,
      'tacklePoints': 65,
      'form': ['L', 'W', 'L', 'L', 'L'],
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
          'Points Table',
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
      body: Column(
        children: [
          // Header Stats
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF4C085D).withOpacity(0.5),
                  const Color(0xFF9333EA).withOpacity(0.3),
                ],
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatItem('Total Teams', '${_teams.length}'),
                _buildStatItem('Matches Played', '60'),
                _buildStatItem('Season', '2026'),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Table Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFF9333EA).withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Row(
                children: [
                  SizedBox(width: 30, child: Text('#', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold))),
                  SizedBox(width: 8),
                  Expanded(child: Text('Team', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold))),
                  SizedBox(width: 40, child: Text('P', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold), textAlign: TextAlign.center)),
                  SizedBox(width: 40, child: Text('W', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold), textAlign: TextAlign.center)),
                  SizedBox(width: 40, child: Text('L', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold), textAlign: TextAlign.center)),
                  SizedBox(width: 40, child: Text('Pts', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold), textAlign: TextAlign.center)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          // Teams List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _teams.length,
              itemBuilder: (context, index) {
                final team = _teams[index];
                return _buildTeamRow(team, index);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Color(0xFF9333EA),
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: Colors.white.withOpacity(0.6),
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildTeamRow(Map<String, dynamic> team, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.05),
            Colors.white.withOpacity(0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
        ),
      ),
      child: Row(
        children: [
          // Position
          SizedBox(
            width: 30,
            child: Text(
              '${team['position']}',
              style: TextStyle(
                color: team['position'] <= 2 ? const Color(0xFF9333EA) : Colors.white70,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 8),
          // Team Name & Form
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  team['name'],
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: (team['form'] as List<String>).map((result) {
                    return Container(
                      margin: const EdgeInsets.only(right: 4),
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: result == 'W' ? Colors.green.withOpacity(0.3) : Colors.red.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        result,
                        style: TextStyle(
                          color: result == 'W' ? Colors.green : Colors.red,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          // Stats
          SizedBox(
            width: 40,
            child: Text(
              '${team['played']}',
              style: const TextStyle(color: Colors.white70, fontSize: 13),
              textAlign: TextAlign.center,
            ),
          ),
          SizedBox(
            width: 40,
            child: Text(
              '${team['won']}',
              style: const TextStyle(color: Colors.green, fontSize: 13),
              textAlign: TextAlign.center,
            ),
          ),
          SizedBox(
            width: 40,
            child: Text(
              '${team['lost']}',
              style: const TextStyle(color: Colors.red, fontSize: 13),
              textAlign: TextAlign.center,
            ),
          ),
          SizedBox(
            width: 40,
            child: Text(
              '${team['points']}',
              style: const TextStyle(color: Color(0xFF9333EA), fontSize: 13, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms, delay: (index * 50).ms).slideX(begin: -0.1, end: 0);
  }
}
