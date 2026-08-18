import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';

class PremiumMatchesScreen extends StatefulWidget {
  const PremiumMatchesScreen({super.key});

  @override
  State<PremiumMatchesScreen> createState() => _PremiumMatchesScreenState();
}

class _PremiumMatchesScreenState extends State<PremiumMatchesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
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
      body: TabBarView(
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
    return ListView(
      padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
      children: [
        _buildMatchCard(
          isLive: true,
          team1: 'Delhi Warriors',
          team2: 'Punjab Wings',
          team1Score: '28',
          team2Score: '24',
          matchTime: 'Q3 • 5:30 left',
          venue: 'Delhi Stadium',
          quarter: 'Q3',
        ),
        _buildMatchCard(
          isLive: true,
          team1: 'Mumbai Strikers',
          team2: 'Kolkata Rangers',
          team1Score: '22',
          team2Score: '20',
          matchTime: 'Q2 • 8:15 left',
          venue: 'Mumbai Arena',
          quarter: 'Q2',
        ),
      ],
    );
  }

  Widget _buildUpcomingMatches() {
    return ListView(
      padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
      children: [
        _buildMatchCard(
          isLive: false,
          team1: 'Gujarat Gems',
          team2: 'Ayodhya Shakti',
          team1Score: '-',
          team2Score: '-',
          matchTime: 'Aug 15, 7:00 PM',
          venue: 'Ahmedabad Stadium',
          quarter: null,
        ),
        _buildMatchCard(
          isLive: false,
          team1: 'Namma Bengaluru',
          team2: 'Haryanvi Fighters',
          team1Score: '-',
          team2Score: '-',
          matchTime: 'Aug 16, 8:00 PM',
          venue: 'Bangalore Arena',
          quarter: null,
        ),
        _buildMatchCard(
          isLive: false,
          team1: 'Kashmiri Queens',
          team2: 'Delhi Warriors',
          team1Score: '-',
          team2Score: '-',
          matchTime: 'Aug 17, 7:30 PM',
          venue: 'Srinagar Arena',
          quarter: null,
        ),
      ],
    );
  }

  Widget _buildCompletedMatches() {
    return ListView(
      padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
      children: [
        _buildMatchCard(
          isLive: false,
          team1: 'Punjab Wings',
          team2: 'Mumbai Strikers',
          team1Score: '35',
          team2Score: '30',
          matchTime: 'Aug 12, Final',
          venue: 'Mohali Stadium',
          quarter: 'FT',
          isCompleted: true,
        ),
        _buildMatchCard(
          isLive: false,
          team1: 'Kolkata Rangers',
          team2: 'Gujarat Gems',
          team1Score: '28',
          team2Score: '32',
          matchTime: 'Aug 11, Final',
          venue: 'Kolkata Stadium',
          quarter: 'FT',
          isCompleted: true,
        ),
      ],
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
