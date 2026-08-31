import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:iwkl_app/core/constants/app_constants.dart';
import 'package:iwkl_app/core/widgets/glass_card.dart';
import 'package:iwkl_app/core/widgets/premium_app_bar.dart';

class TeamProfileScreen extends StatelessWidget {
  final TeamProfileData team;

  const TeamProfileScreen({
    super.key,
    required this.team,
  });

  @override
  Widget build(BuildContext context) {
    final teamColor = AppConstants.teamColors[team.name] ?? AppConstants.primaryColorValue;
    final teamSecondaryColor = AppConstants.teamSecondaryColors[team.name] ?? AppConstants.accentColorValue;
    final teamGradient = AppConstants.teamGradients[team.name] ?? [teamColor, teamSecondaryColor];
    final teamGlowColor = AppConstants.teamGlowColors[team.name] ?? teamColor;

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: PremiumAppBar(
        showLogo: false,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: CustomScrollView(
        slivers: [
          // Hero Banner
          SliverAppBar(
            expandedHeight: 350,
            pinned: true,
            backgroundColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  // Background Gradient
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Color(teamGradient[0]),
                          Color(teamGradient[1]),
                          const Color(AppConstants.backgroundColorValue),
                        ],
                      ),
                    ),
                  ),
                  
                  // Radial Glow Effect
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: RadialGradient(
                          center: Alignment.center,
                          radius: 1.5,
                          colors: [
                            Color(teamGlowColor).withOpacity(0.3),
                            Colors.transparent,
                          ],
                        ),
                      ),
                    ),
                  ),
                  
                  // Team Logo with Animation
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 140,
                          height: 140,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: const Color(AppConstants.accentColorValue),
                              width: 4,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Color(teamGlowColor).withOpacity(0.6),
                                blurRadius: 40,
                                spreadRadius: 15,
                              ),
                              BoxShadow(
                                color: const Color(AppConstants.accentColorValue).withOpacity(0.4),
                                blurRadius: 30,
                                spreadRadius: 10,
                              ),
                            ],
                          ),
                          child: ClipOval(
                            child: team.logo != null
                                ? Image.asset(
                                    team.logo!,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) {
                                      return const Icon(Icons.sports_cricket, color: Colors.white, size: 60);
                                    },
                                  )
                                : const Icon(Icons.sports_cricket, color: Colors.white, size: 60),
                          ),
                        ).animate().scale(duration: 600.ms, curve: Curves.elasticOut),
                        const SizedBox(height: 20),
                        Text(
                          team.name,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 2,
                          ),
                        ).animate().fadeIn(duration: 400.ms, delay: 200.ms).slideY(begin: 0.3, end: 0),
                        const SizedBox(height: 8),
                        Text(
                          team.tagline ?? 'Champions in the Making',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.8),
                            fontSize: 16,
                            letterSpacing: 1,
                          ),
                        ).animate().fadeIn(duration: 400.ms, delay: 300.ms).slideY(begin: 0.3, end: 0),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Quick Stats
                  _buildQuickStats(context, team, teamColor),
                  const SizedBox(height: 24),

                  // Team Info
                  _buildTeamInfo(context, team, teamColor),
                  const SizedBox(height: 24),

                  // Statistics
                  _buildStatistics(context, team, teamColor),
                  const SizedBox(height: 24),

                  // Players
                  _buildPlayersSection(context, team, teamColor),
                  const SizedBox(height: 24),

                  // Achievements
                  _buildAchievements(context, team, teamColor),
                  const SizedBox(height: 24),

                  // Recent Matches
                  _buildRecentMatches(context, team, teamColor),
                  const SizedBox(height: 24),

                  // Gallery
                  _buildGallery(context, team, teamColor),
                  const SizedBox(height: 24),

                  // Videos
                  _buildVideos(context, team, teamColor),
                  const SizedBox(height: 24),

                  // Sponsors
                  _buildSponsors(context, team, teamColor),
                  const SizedBox(height: 24),

                  // Social Media
                  _buildSocialMedia(context, team, teamColor),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickStats(BuildContext context, TeamProfileData team, int teamColor) {
    return GlassCard(
      padding: const EdgeInsets.all(24),
      borderRadius: BorderRadius.circular(30),
      premiumStyle: true,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildQuickStat('Matches', team.played.toString(), Colors.blue),
          _buildQuickStat('Won', team.won.toString(), Colors.green),
          _buildQuickStat('Lost', team.lost.toString(), Colors.red),
          _buildQuickStat('Points', team.points.toString(), Color(teamColor)),
        ],
      ),
    ).animate().fadeIn().slideY(begin: 0.2);
  }

  Widget _buildQuickStat(String label, String value, Color color) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [color, color.withOpacity(0.7)],
            ),
            borderRadius: BorderRadius.circular(15),
            boxShadow: [
              BoxShadow(
                color: color.withOpacity(0.4),
                blurRadius: 15,
                spreadRadius: 2,
              ),
            ],
          ),
          child: Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
              letterSpacing: 1,
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: TextStyle(
            color: Colors.white.withOpacity(0.7),
            fontSize: 14,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
      ],
    );
  }

  Widget _buildTeamInfo(BuildContext context, TeamProfileData team, int teamColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Team Information',
          style: const TextStyle(
            color: Colors.white,
            fontSize: 28,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 16),
        GlassCard(
          padding: const EdgeInsets.all(20),
          borderRadius: BorderRadius.circular(30),
          premiumStyle: true,
          child: Column(
            children: [
              _buildInfoRow('Founded', team.founded?.toString() ?? 'N/A'),
              const Divider(color: Colors.white24),
              _buildInfoRow('Coach', team.coach ?? 'N/A'),
              const Divider(color: Colors.white24),
              _buildInfoRow('Captain', team.captain ?? 'N/A'),
              const Divider(color: Colors.white24),
              _buildInfoRow('Home Ground', team.homeGround ?? 'N/A'),
            ],
          ),
        ),
      ],
    ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.2);
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: Colors.white.withOpacity(0.7),
              fontSize: 16,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.5,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatistics(BuildContext context, TeamProfileData team, int teamColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Season Statistics',
          style: const TextStyle(
            color: Colors.white,
            fontSize: 28,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 16),
        GlassCard(
          padding: const EdgeInsets.all(20),
          borderRadius: BorderRadius.circular(30),
          premiumStyle: true,
          child: Column(
            children: [
              _buildStatRow('Raid Points', team.raidPoints?.toString() ?? '0', Colors.purple),
              const Divider(color: Colors.white24),
              _buildStatRow('Tackle Points', team.tacklePoints?.toString() ?? '0', Colors.teal),
              const Divider(color: Colors.white24),
              _buildStatRow('Super Raids', team.superRaids?.toString() ?? '0', Colors.orange),
              const Divider(color: Colors.white24),
              _buildStatRow('Super Tackles', team.superTackles?.toString() ?? '0', Colors.pink),
              const Divider(color: Colors.white24),
              _buildStatRow('All Outs', team.allOuts?.toString() ?? '0', Colors.red),
            ],
          ),
        ),
      ],
    ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.2);
  }

  Widget _buildStatRow(String label, String value, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: Colors.white.withOpacity(0.7),
              fontSize: 16,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.5,
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [color, color.withOpacity(0.7)],
              ),
              borderRadius: BorderRadius.circular(15),
              boxShadow: [
                BoxShadow(
                  color: color.withOpacity(0.4),
                  blurRadius: 15,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Text(
              value,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlayersSection(BuildContext context, TeamProfileData team, int teamColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Players',
              style: TextStyle(
                color: Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
            TextButton(
              onPressed: () {},
              child: Text('View All', style: TextStyle(color: Color(AppConstants.accentColorValue))),
            ),
          ],
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 140,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: team.players.take(5).length,
            itemBuilder: (context, index) {
              final player = team.players[index];
              return Padding(
                padding: const EdgeInsets.only(right: 12),
                child: GlassCard(
                  padding: const EdgeInsets.all(16),
                  borderRadius: BorderRadius.circular(25),
                  premiumStyle: true,
                  child: Column(
                    children: [
                      Container(
                        width: 70,
                        height: 70,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Color(teamColor),
                              Color(teamColor).withOpacity(0.7),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Color(teamColor).withOpacity(0.4),
                              blurRadius: 15,
                              spreadRadius: 2,
                            ),
                          ],
                        ),
                        child: const Icon(Icons.person, color: Colors.white, size: 35),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        player.name,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        player.role,
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.7),
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.2);
  }

  Widget _buildAchievements(BuildContext context, TeamProfileData team, int teamColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Achievements',
          style: TextStyle(
            color: Colors.white,
            fontSize: 28,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 16),
        GlassCard(
          padding: const EdgeInsets.all(20),
          borderRadius: BorderRadius.circular(30),
          premiumStyle: true,
          child: Column(
            children: team.achievements.map((achievement) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            const Color(AppConstants.accentColorValue),
                            const Color(AppConstants.accentColorValue).withOpacity(0.7),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(AppConstants.accentColorValue).withOpacity(0.4),
                            blurRadius: 10,
                            spreadRadius: 2,
                          ),
                        ],
                      ),
                      child: const Icon(Icons.emoji_events, color: Colors.black, size: 20),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        achievement,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ),
      ],
    ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.2);
  }

  Widget _buildRecentMatches(BuildContext context, TeamProfileData team, int teamColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Recent Matches',
              style: TextStyle(
                color: Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
            TextButton(
              onPressed: () {},
              child: Text('View All', style: TextStyle(color: Color(AppConstants.accentColorValue))),
            ),
          ],
        ),
        const SizedBox(height: 16),
        ...team.recentMatches.map((match) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: GlassCard(
              padding: const EdgeInsets.all(20),
              borderRadius: BorderRadius.circular(30),
              premiumStyle: true,
              child: Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Color(teamColor),
                          Color(teamColor).withOpacity(0.7),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(15),
                      boxShadow: [
                        BoxShadow(
                          color: Color(teamColor).withOpacity(0.4),
                          blurRadius: 15,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(15),
                      child: team.logo != null
                          ? Image.asset(team.logo!, fit: BoxFit.cover)
                          : const Icon(Icons.sports_cricket, color: Colors.white),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          match.opponent,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          match.date,
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.7),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: match.result == 'Won'
                            ? [Colors.green, Colors.green.withOpacity(0.7)]
                            : match.result == 'Lost'
                                ? [Colors.red, Colors.red.withOpacity(0.7)]
                                : [Colors.grey, Colors.grey.withOpacity(0.7)],
                      ),
                      borderRadius: BorderRadius.circular(15),
                      boxShadow: [
                        BoxShadow(
                          color: (match.result == 'Won' ? Colors.green : match.result == 'Lost' ? Colors.red : Colors.grey).withOpacity(0.4),
                          blurRadius: 15,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: Text(
                      match.result,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ],
    ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.2);
  }

  Widget _buildGallery(BuildContext context, TeamProfileData team, int teamColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Gallery',
              style: TextStyle(
                color: Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
            TextButton(
              onPressed: () {},
              child: Text('View All', style: TextStyle(color: Color(AppConstants.accentColorValue))),
            ),
          ],
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 120,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: team.gallery.take(5).length,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(right: 12),
                child: Container(
                  width: 160,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    gradient: LinearGradient(
                      colors: [
                        Color(teamColor).withOpacity(0.3),
                        Color(teamColor).withOpacity(0.1),
                      ],
                    ),
                    border: Border.all(
                      color: Color(teamColor).withOpacity(0.5),
                      width: 1,
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(20),
                    child: team.gallery[index].startsWith('http')
                        ? Image.network(
                            team.gallery[index],
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                color: Colors.grey,
                                child: const Icon(Icons.image, color: Colors.white54),
                              );
                            },
                          )
                        : Image.asset(
                            team.gallery[index],
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                color: Colors.grey,
                                child: const Icon(Icons.image, color: Colors.white54),
                              );
                            },
                          ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    ).animate().fadeIn(delay: 600.ms).slideY(begin: 0.2);
  }

  Widget _buildVideos(BuildContext context, TeamProfileData team, int teamColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Videos',
              style: TextStyle(
                color: Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
            TextButton(
              onPressed: () {},
              child: Text('View All', style: TextStyle(color: Color(AppConstants.accentColorValue))),
            ),
          ],
        ),
        const SizedBox(height: 16),
        ...team.videos.take(3).map((video) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: GlassCard(
              padding: const EdgeInsets.all(16),
              borderRadius: BorderRadius.circular(20),
              premiumStyle: true,
              child: Row(
                children: [
                  Container(
                    width: 120,
                    height: 70,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Color(teamColor).withOpacity(0.3),
                          Color(teamColor).withOpacity(0.1),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: const Center(
                      child: Icon(Icons.play_circle_outline, size: 40, color: Colors.white70),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          video.title,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          video.duration,
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.6),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ],
    ).animate().fadeIn(delay: 700.ms).slideY(begin: 0.2);
  }

  Widget _buildSponsors(BuildContext context, TeamProfileData team, int teamColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Sponsors',
          style: TextStyle(
            color: Colors.white,
            fontSize: 28,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 16),
        GlassCard(
          padding: const EdgeInsets.all(20),
          borderRadius: BorderRadius.circular(30),
          premiumStyle: true,
          child: Wrap(
            spacing: 16,
            runSpacing: 16,
            children: team.sponsors.map((sponsor) {
              return Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(15),
                ),
                child: sponsor.startsWith('http')
                    ? Image.network(sponsor, fit: BoxFit.contain)
                    : Image.asset(sponsor, fit: BoxFit.contain),
              );
            }).toList(),
          ),
        ),
      ],
    ).animate().fadeIn(delay: 800.ms).slideY(begin: 0.2);
  }

  Widget _buildSocialMedia(BuildContext context, TeamProfileData team, int teamColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Follow Us',
          style: TextStyle(
            color: Colors.white,
            fontSize: 28,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 16),
        GlassCard(
          padding: const EdgeInsets.all(20),
          borderRadius: BorderRadius.circular(30),
          premiumStyle: true,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildSocialIcon(Icons.facebook, team.socialMedia['facebook'] ?? '', Colors.blue),
              _buildSocialIcon(Icons.camera_alt, team.socialMedia['instagram'] ?? '', Colors.pink),
              _buildSocialIcon(Icons.alternate_email, team.socialMedia['twitter'] ?? '', Colors.lightBlue),
              _buildSocialIcon(Icons.play_arrow, team.socialMedia['youtube'] ?? '', Colors.red),
            ],
          ),
        ),
      ],
    ).animate().fadeIn(delay: 900.ms).slideY(begin: 0.2);
  }

  Widget _buildSocialIcon(IconData icon, String url, Color color) {
    return InkWell(
      onTap: () {},
      child: Container(
        width: 50,
        height: 50,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [color, color.withOpacity(0.7)],
          ),
          borderRadius: BorderRadius.circular(15),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.4),
              blurRadius: 15,
              spreadRadius: 2,
            ),
          ],
        ),
        child: Icon(icon, color: Colors.white, size: 24),
      ),
    );
  }
}

class TeamProfileData {
  final String name;
  final String? logo;
  final String? tagline;
  final int? founded;
  final String? coach;
  final String? captain;
  final String? homeGround;
  final int played;
  final int won;
  final int lost;
  final int points;
  final int? raidPoints;
  final int? tacklePoints;
  final int? superRaids;
  final int? superTackles;
  final int? allOuts;
  final List<PlayerData> players;
  final List<String> achievements;
  final List<MatchData> recentMatches;
  final List<String> gallery;
  final List<VideoData> videos;
  final List<String> sponsors;
  final Map<String, String> socialMedia;

  TeamProfileData({
    required this.name,
    this.logo,
    this.tagline,
    this.founded,
    this.coach,
    this.captain,
    this.homeGround,
    required this.played,
    required this.won,
    required this.lost,
    required this.points,
    this.raidPoints,
    this.tacklePoints,
    this.superRaids,
    this.superTackles,
    this.allOuts,
    required this.players,
    required this.achievements,
    required this.recentMatches,
    required this.gallery,
    required this.videos,
    required this.sponsors,
    required this.socialMedia,
  });
}

class PlayerData {
  final String name;
  final String role;
  final int jerseyNumber;
  final String? avatar;

  PlayerData({
    required this.name,
    required this.role,
    required this.jerseyNumber,
    this.avatar,
  });
}

class MatchData {
  final String opponent;
  final String date;
  final String result;
  final bool won;

  MatchData({
    required this.opponent,
    required this.date,
    required this.result,
    required this.won,
  });
}

class VideoData {
  final String title;
  final String duration;
  final String? thumbnail;

  VideoData({
    required this.title,
    required this.duration,
    this.thumbnail,
  });
}
