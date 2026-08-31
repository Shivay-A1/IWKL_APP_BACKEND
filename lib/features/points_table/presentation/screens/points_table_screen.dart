import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:dio/dio.dart';
import 'package:iwkl_app/core/constants/app_constants.dart';

class PointsTableScreen extends StatefulWidget {
  const PointsTableScreen({super.key});

  @override
  State<PointsTableScreen> createState() => _PointsTableScreenState();
}

class _PointsTableScreenState extends State<PointsTableScreen> {
  List<dynamic> _teams = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchPointsTable();
  }

  Future<void> _fetchPointsTable() async {
    try {
      final dio = Dio();
      final response = await dio.get('${AppConstants.baseUrl}/points-table');

      if (response.statusCode == 200) {
        final data = response.data;
        // Handle different response structures
        if (data is Map && data['data'] is List) {
          setState(() {
            _teams = data['data'];
            _isLoading = false;
          });
        } else if (data is List) {
          setState(() {
            _teams = data;
            _isLoading = false;
          });
        }
      }
    } catch (e) {
      setState(() {
        _error = 'Failed to load points table';
        _isLoading = false;
      });
    }
  }

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
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: _fetchPointsTable,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFF9333EA)),
            )
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _error!,
                        style: const TextStyle(color: Colors.white),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _fetchPointsTable,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF9333EA),
                        ),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : _teams.isEmpty
                  ? const Center(
                      child: Text(
                        'No points table data available',
                        style: TextStyle(color: Colors.white70),
                      ),
                    )
                  : Column(
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

  Widget _buildTeamRow(dynamic team, int index) {
    final position = index + 1;
    final teamName = team['team']?['name'] ?? team['teamName'] ?? 'Unknown Team';
    final played = team['matchesPlayed'] ?? team['played'] ?? 0;
    final won = team['matchesWon'] ?? team['won'] ?? 0;
    final lost = team['matchesLost'] ?? team['lost'] ?? 0;
    final points = team['points'] ?? 0;
    final raidPoints = team['raidPoints'] ?? 0;
    final tacklePoints = team['tacklePoints'] ?? 0;

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
              '$position',
              style: TextStyle(
                color: position <= 2 ? const Color(0xFF9333EA) : Colors.white70,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 8),
          // Team Name
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  teamName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Raid: $raidPoints | Tackle: $tacklePoints',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.5),
                    fontSize: 10,
                  ),
                ),
              ],
            ),
          ),
          // Stats
          SizedBox(
            width: 40,
            child: Text(
              '$played',
              style: const TextStyle(color: Colors.white70, fontSize: 13),
              textAlign: TextAlign.center,
            ),
          ),
          SizedBox(
            width: 40,
            child: Text(
              '$won',
              style: const TextStyle(color: Colors.green, fontSize: 13),
              textAlign: TextAlign.center,
            ),
          ),
          SizedBox(
            width: 40,
            child: Text(
              '$lost',
              style: const TextStyle(color: Colors.red, fontSize: 13),
              textAlign: TextAlign.center,
            ),
          ),
          SizedBox(
            width: 40,
            child: Text(
              '$points',
              style: const TextStyle(color: Color(0xFF9333EA), fontSize: 13, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms, delay: (index * 50).ms).slideX(begin: -0.1, end: 0);
  }
}
