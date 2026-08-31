import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:dio/dio.dart';
import 'package:iwkl_app/core/constants/app_constants.dart';

class ScheduleScreen extends StatefulWidget {
  const ScheduleScreen({super.key});

  @override
  State<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  List<dynamic> _matches = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchMatches();
  }

  Future<void> _fetchMatches() async {
    try {
      final dio = Dio();
      final response = await dio.get('${AppConstants.baseUrl}/matches');

      if (response.statusCode == 200) {
        final data = response.data;
        // Handle different response structures
        if (data is Map && data['data'] is List) {
          setState(() {
            _matches = data['data'];
            _isLoading = false;
          });
        } else if (data is List) {
          setState(() {
            _matches = data;
            _isLoading = false;
          });
        }
      }
    } catch (e) {
      setState(() {
        _error = 'Failed to load matches';
        _isLoading = false;
      });
    }
  }

  String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      return '${date.day}/${date.month}/${date.year}';
    } catch (e) {
      return dateString;
    }
  }

  String _formatTime(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      return '${date.hour}:${date.minute.toString().padLeft(2, '0')}';
    } catch (e) {
      return '';
    }
  }

  String _getStatusColor(String status) {
    switch (status.toUpperCase()) {
      case 'LIVE':
        return '#EF4444'; // Red
      case 'COMPLETED':
        return '#10B981'; // Green
      case 'SCHEDULED':
      case 'UPCOMING':
        return '#9333EA'; // Purple
      default:
        return '#6B7280'; // Gray
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
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: _fetchMatches,
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
                        onPressed: _fetchMatches,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF9333EA),
                        ),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : _matches.isEmpty
                  ? const Center(
                      child: Text(
                        'No matches scheduled',
                        style: TextStyle(color: Colors.white),
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _matches.length,
                      itemBuilder: (context, index) {
                        final match = _matches[index];
                        return _buildMatchCard(match, index);
                      },
                    ),
    );
  }

  Widget _buildMatchCard(dynamic match, int index) {
    final homeTeam = match['homeTeam']?['name'] ?? match['homeTeamName'] ?? 'Home Team';
    final awayTeam = match['awayTeam']?['name'] ?? match['awayTeamName'] ?? 'Away Team';
    final venue = match['venue'] ?? 'Unknown Venue';
    final status = match['status'] ?? 'SCHEDULED';
    final matchDate = match['matchDate'] ?? match['scheduledAt'] ?? '';
    final dateStr = _formatDate(matchDate);
    final timeStr = _formatTime(matchDate);

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
                  color: Color(int.parse(_getStatusColor(status).replaceAll('#', '0xFF'))),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  status.toUpperCase(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Text(
                '$dateStr • $timeStr',
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
                      homeTeam,
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
                      awayTeam,
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
                venue,
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
