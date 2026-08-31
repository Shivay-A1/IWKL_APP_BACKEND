import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:dio/dio.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../../core/constants/app_constants.dart';

class PremiumMatchesScreen extends StatefulWidget {
  const PremiumMatchesScreen({super.key});

  @override
  State<PremiumMatchesScreen> createState() => _PremiumMatchesScreenState();
}

class _PremiumMatchesScreenState extends State<PremiumMatchesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _allMatches = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
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
            _allMatches = data['data'];
            _isLoading = false;
          });
        } else if (data is List) {
          setState(() {
            _allMatches = data;
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

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<dynamic> _getLiveMatches() {
    return _allMatches.where((m) => m['status'] == 'LIVE').toList();
  }

  List<dynamic> _getUpcomingMatches() {
    return _allMatches.where((m) => m['status'] == 'SCHEDULED').toList();
  }

  List<dynamic> _getCompletedMatches() {
    return _allMatches.where((m) => m['status'] == 'COMPLETED').toList();
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
      final minute = date.minute < 10 ? '0${date.minute}' : '${date.minute}';
      return '${date.hour}:$minute';
    } catch (e) {
      return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppDesignSystem.primaryBackground,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Matches',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: _fetchMatches,
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppDesignSystem.gold,
          labelColor: AppDesignSystem.gold,
          unselectedLabelColor: AppDesignSystem.mutedText,
          labelStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
          tabs: const [
            Tab(text: 'LIVE'),
            Tab(text: 'UPCOMING'),
            Tab(text: 'COMPLETED'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(color: AppDesignSystem.gold),
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
                          backgroundColor: AppDesignSystem.primaryPurple,
                        ),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : TabBarView(
                  controller: _tabController,
                  children: [
                    _buildLiveMatches(),
                    _buildUpcomingMatches(),
                    _buildCompletedMatches(),
                  ],
                ),
    );
  }

  Widget _buildLiveMatches() {
    final liveMatches = _getLiveMatches();
    if (liveMatches.isEmpty) {
      return const Center(
        child: Text(
          'No live matches',
          style: TextStyle(color: AppDesignSystem.mutedText),
        ),
      );
    }
    return ListView(
      padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
      children: liveMatches.map((match) => _buildMatchCardFromApi(match, true)).toList(),
    );
  }

  Widget _buildUpcomingMatches() {
    final upcomingMatches = _getUpcomingMatches();
    if (upcomingMatches.isEmpty) {
      return const Center(
        child: Text(
          'No upcoming matches',
          style: TextStyle(color: AppDesignSystem.mutedText),
        ),
      );
    }
    return ListView(
      padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
      children: upcomingMatches.map((match) => _buildMatchCardFromApi(match, false)).toList(),
    );
  }

  Widget _buildCompletedMatches() {
    final completedMatches = _getCompletedMatches();
    if (completedMatches.isEmpty) {
      return const Center(
        child: Text(
          'No completed matches',
          style: TextStyle(color: AppDesignSystem.mutedText),
        ),
      );
    }
    return ListView(
      padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
      children: completedMatches.map((match) => _buildMatchCardFromApi(match, false, true)).toList(),
    );
  }

  Widget _buildMatchCardFromApi(dynamic match, bool isLive, [bool isCompleted = false]) {
    final homeTeam = match['homeTeam']?['name'] ?? match['homeTeamName'] ?? 'Home Team';
    final awayTeam = match['awayTeam']?['name'] ?? match['awayTeamName'] ?? 'Away Team';
    final homeScore = match['homeScore']?.toString() ?? '-';
    final awayScore = match['awayScore']?.toString() ?? '-';
    final venue = match['venue'] ?? 'Unknown Venue';
    final matchDate = match['matchDate'] ?? match['scheduledAt'] ?? '';
    final dateStr = _formatDate(matchDate);
    final timeStr = _formatTime(matchDate);
    final matchTimer = match['matchTimer'] ?? '';
    final matchTime = isLive ? matchTimer : '$dateStr $timeStr';
    final quarter = isLive ? match['halfTimeStatus'] ?? (isCompleted ? 'FT' : null) : null;

    return _buildMatchCard(
      isLive: isLive,
      team1: homeTeam,
      team2: awayTeam,
      team1Score: homeScore,
      team2Score: awayScore,
      matchTime: matchTime,
      venue: venue,
      quarter: quarter,
      isCompleted: isCompleted,
    );
  }

  Widget _buildMatchCard({
    required bool isLive,
    required String team1,
    required String team2,
    required String team1Score,
    required String team2Score,
    required String matchTime,
    required String venue,
    String? quarter,
    bool isCompleted = false,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppDesignSystem.lgSpacing),
      decoration: AppDesignSystem.premiumCardDecoration,
      child: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(AppDesignSystem.mdSpacing),
            child: Row(
              children: [
                if (isLive) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Colors.red, Colors.redAccent],
                      ),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text(
                      'LIVE',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                      ),
                    ),
                  ),
                  const SizedBox(width: AppDesignSystem.smSpacing),
                  Icon(
                    Icons.circle,
                    size: 8,
                    color: Colors.red,
                  ).animate(onPlay: (controller) => controller.repeat()).fadeIn(duration: const Duration(milliseconds: 500)).then().fadeOut(
                    duration: const Duration(milliseconds: 500),
                  ),
                ] else if (isCompleted) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppDesignSystem.mutedText.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text(
                      'FT',
                      style: TextStyle(
                        color: AppDesignSystem.mutedText,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ] else ...[
                  Icon(
                    Icons.calendar_today,
                    size: 16,
                    color: AppDesignSystem.mutedText,
                  ),
                  const SizedBox(width: AppDesignSystem.smSpacing),
                ],
                const Spacer(),
                Text(
                  matchTime,
                  style: AppDesignSystem.softGreyCaption,
                ),
              ],
            ),
          ),
          const Divider(color: AppDesignSystem.divider, height: 1),
          // Match Content
          Padding(
            padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
            child: Row(
              children: [
                // Team 1
                Expanded(
                  child: Column(
                    children: [
                      Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppDesignSystem.cardBackground,
                          border: Border.all(
                            color: AppDesignSystem.primaryPurple.withOpacity(0.3),
                            width: 2,
                          ),
                        ),
                        child: const Icon(
                          Icons.sports_kabaddi,
                          size: 30,
                          color: AppDesignSystem.mutedText,
                        ),
                      ),
                      const SizedBox(height: AppDesignSystem.smSpacing),
                      Text(
                        team1,
                        style: AppDesignSystem.readableBody,
                        textAlign: TextAlign.center,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                // Score
                Column(
                  children: [
                    Row(
                      children: [
                        Text(
                          team1Score,
                          style: const TextStyle(
                            fontSize: 36,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(width: AppDesignSystem.mdSpacing),
                        const Text(
                          '-',
                          style: TextStyle(
                            fontSize: 36,
                            fontWeight: FontWeight.bold,
                            color: AppDesignSystem.mutedText,
                          ),
                        ),
                        const SizedBox(width: AppDesignSystem.mdSpacing),
                        Text(
                          team2Score,
                          style: const TextStyle(
                            fontSize: 36,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                    if (quarter != null) ...[
                      const SizedBox(height: AppDesignSystem.smSpacing),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          gradient: isLive
                              ? AppDesignSystem.goldGradient
                              : null,
                          color: isLive ? null : AppDesignSystem.cardBackground,
                          borderRadius: BorderRadius.circular(20),
                          border: isLive
                              ? null
                              : Border.all(
                                  color: AppDesignSystem.mutedText.withOpacity(0.3),
                                  width: 1,
                                ),
                        ),
                        child: Text(
                          quarter,
                          style: TextStyle(
                            color: isLive ? Colors.black : AppDesignSystem.mutedText,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                // Team 2
                Expanded(
                  child: Column(
                    children: [
                      Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppDesignSystem.cardBackground,
                          border: Border.all(
                            color: AppDesignSystem.primaryPurple.withOpacity(0.3),
                            width: 2,
                          ),
                        ),
                        child: const Icon(
                          Icons.sports_kabaddi,
                          size: 30,
                          color: AppDesignSystem.mutedText,
                        ),
                      ),
                      const SizedBox(height: AppDesignSystem.smSpacing),
                      Text(
                        team2,
                        style: AppDesignSystem.readableBody,
                        textAlign: TextAlign.center,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(color: AppDesignSystem.divider, height: 1),
          // Footer
          Padding(
            padding: const EdgeInsets.all(AppDesignSystem.mdSpacing),
            child: Row(
              children: [
                Icon(Icons.location_on, size: 16, color: AppDesignSystem.mutedText),
                const SizedBox(width: AppDesignSystem.smSpacing),
                Expanded(
                  child: Text(
                    venue,
                    style: AppDesignSystem.softGreyCaption,
                  ),
                ),
                if (isLive)
                  ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.play_arrow, size: 16),
                    label: const Text('Watch'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppDesignSystem.primaryPurple,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppDesignSystem.mdRadius),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: AppDesignSystem.fastAnimation).slideY(
      begin: 0.2,
      end: 0,
      curve: AppDesignSystem.smoothCurve,
    );
  }
}
