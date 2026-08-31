import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:dio/dio.dart';
import 'package:iwkl_app/core/constants/app_constants.dart';

class LiveMatchScreen extends StatefulWidget {
  const LiveMatchScreen({super.key});

  @override
  State<LiveMatchScreen> createState() => _LiveMatchScreenState();
}

class _LiveMatchScreenState extends State<LiveMatchScreen> {
  dynamic _liveMatch = null;
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchLiveMatch();
  }

  Future<void> _fetchLiveMatch() async {
    try {
      final dio = Dio();
      final response = await dio.get('${AppConstants.baseUrl}/matches/live');

      if (response.statusCode == 200) {
        final data = response.data;
        // Handle different response structures
        if (data is Map && data['data'] is List && data['data'].isNotEmpty) {
          setState(() {
            _liveMatch = data['data'][0]; // Get first live match
            _isLoading = false;
          });
        } else if (data is List && data.isNotEmpty) {
          setState(() {
            _liveMatch = data[0]; // Get first live match
            _isLoading = false;
          });
        } else {
          setState(() {
            _isLoading = false;
          });
        }
      }
    } catch (e) {
      setState(() {
        _error = 'Failed to load live match';
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
          'Live Match',
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
            onPressed: _fetchLiveMatch,
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
                        onPressed: _fetchLiveMatch,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF9333EA),
                        ),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : _liveMatch == null
                  ? const Center(
                      child: Text(
                        'No live match in progress',
                        style: TextStyle(color: Colors.white70),
                      ),
                    )
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Match Card
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  const Color(0xFF4C085D).withOpacity(0.5),
                                  const Color(0xFF9333EA).withOpacity(0.3),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: const Color(0xFF9333EA).withOpacity(0.5),
                              ),
                            ),
                            child: Column(
                              children: [
                                // Teams
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Column(
                                        children: [
                                          Container(
                                            width: 80,
                                            height: 80,
                                            decoration: BoxDecoration(
                                              shape: BoxShape.circle,
                                              gradient: LinearGradient(
                                                colors: [
                                                  const Color(0xFF4C085D).withOpacity(0.5),
                                                  const Color(0xFF6F1AB6).withOpacity(0.3),
                                                ],
                                              ),
                                            ),
                                            child: _liveMatch['homeTeam']?['logo'] != null
                                                ? ClipOval(
                                                    child: Image.network(
                                                      _liveMatch['homeTeam']['logo'],
                                                      fit: BoxFit.cover,
                                                      errorBuilder: (context, error, stackTrace) {
                                                        return const Icon(
                                                          Icons.sports_kabaddi,
                                                          size: 40,
                                                          color: Colors.white,
                                                        );
                                                      },
                                                    ),
                                                  )
                                                : const Icon(
                                                    Icons.sports_kabaddi,
                                                    size: 40,
                                                    color: Colors.white,
                                                  ),
                                          ),
                                          const SizedBox(height: 12),
                                          Text(
                                            _liveMatch['homeTeam']?['name'] ?? _liveMatch['homeTeamName'] ?? 'Home Team',
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                            ),
                                            textAlign: TextAlign.center,
                                          ),
                                        ],
                                      ),
                                    ),
                                    Column(
                                      children: [
                                        Text(
                                          '${_liveMatch['homeScore'] ?? 0} - ${_liveMatch['awayScore'] ?? 0}',
                                          style: const TextStyle(
                                            color: Color(0xFF9333EA),
                                            fontSize: 32,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        const SizedBox(height: 8),
                                        Text(
                                          _liveMatch['matchTimer'] ?? _liveMatch['halfTimeStatus'] ?? 'LIVE',
                                          style: const TextStyle(
                                            color: Colors.white70,
                                            fontSize: 14,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Expanded(
                                      child: Column(
                                        children: [
                                          Container(
                                            width: 80,
                                            height: 80,
                                            decoration: BoxDecoration(
                                              shape: BoxShape.circle,
                                              gradient: LinearGradient(
                                                colors: [
                                                  const Color(0xFFEC4899).withOpacity(0.5),
                                                  const Color(0xFF9333EA).withOpacity(0.3),
                                                ],
                                              ),
                                            ),
                                            child: _liveMatch['awayTeam']?['logo'] != null
                                                ? ClipOval(
                                                    child: Image.network(
                                                      _liveMatch['awayTeam']['logo'],
                                                      fit: BoxFit.cover,
                                                      errorBuilder: (context, error, stackTrace) {
                                                        return const Icon(
                                                          Icons.sports_kabaddi,
                                                          size: 40,
                                                          color: Colors.white,
                                                        );
                                                      },
                                                    ),
                                                  )
                                                : const Icon(
                                                    Icons.sports_kabaddi,
                                                    size: 40,
                                                    color: Colors.white,
                                                  ),
                                          ),
                                          const SizedBox(height: 12),
                                          Text(
                                            _liveMatch['awayTeam']?['name'] ?? _liveMatch['awayTeamName'] ?? 'Away Team',
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                            ),
                                            textAlign: TextAlign.center,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ).animate().fadeIn(duration: 300.ms).scale(begin: const Offset(0.9, 0.9)),
                          const SizedBox(height: 24),

                          // Match Stats
                          _buildSectionTitle('Match Statistics'),
                          const SizedBox(height: 12),
                          _buildStatRow('Total Points', '${_liveMatch['homeScore'] ?? 0}', '${_liveMatch['awayScore'] ?? 0}'),
                          _buildStatRow('Raid Points', '${_liveMatch['homeRaidPoints'] ?? 0}', '${_liveMatch['awayRaidPoints'] ?? 0}'),
                          _buildStatRow('Tackle Points', '${_liveMatch['homeTacklePoints'] ?? 0}', '${_liveMatch['awayTacklePoints'] ?? 0}'),
                          _buildStatRow('Bonus Points', '${_liveMatch['homeBonusPoints'] ?? 0}', '${_liveMatch['awayBonusPoints'] ?? 0}'),
                          _buildStatRow('All Outs', '${_liveMatch['homeAllOutCount'] ?? 0}', '${_liveMatch['awayAllOutCount'] ?? 0}'),
                          const SizedBox(height: 24),

                          // Venue
                          _buildSectionTitle('Match Info'),
                          const SizedBox(height: 12),
                          _buildInfoRow('Venue', _liveMatch['venue'] ?? 'Unknown Venue'),
                          _buildInfoRow('Date', _formatDate(_liveMatch['matchDate'] ?? '')),
                          _buildInfoRow('Half', _liveMatch['halfTimeStatus'] ?? 'Unknown'),
                        ],
                      ),
                    ),
    );
  }

  String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      return '${date.day}/${date.month}/${date.year}';
    } catch (e) {
      return dateString;
    }
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

  Widget _buildStatRow(String label, String team1Value, String team2Value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.03),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            team1Value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            label,
            style: TextStyle(
              color: Colors.white.withOpacity(0.6),
              fontSize: 14,
            ),
          ),
          Text(
            team2Value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.03),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: Colors.white.withOpacity(0.6),
              fontSize: 14,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
