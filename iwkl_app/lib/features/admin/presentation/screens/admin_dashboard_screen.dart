import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'ott_teams_screen.dart';
import 'admin_teams_screen.dart';
import 'admin_players_screen.dart';
import 'admin_matches_screen.dart';
import 'admin_news_screen.dart';
import 'admin_gallery_screen.dart';
import 'admin_videos_screen.dart';
import 'admin_notifications_screen.dart';
import 'admin_users_screen.dart';
import 'admin_points_table_screen.dart';
import 'admin_registrations_screen.dart';
import 'admin_support_screen.dart';
import 'admin_settings_screen.dart';
import 'admin_fan_club_screen.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  int _selectedIndex = 0;

  final List<AdminMenuItem> _menuItems = [
    AdminMenuItem(
      icon: Icons.dashboard,
      title: 'Dashboard',
      subtitle: 'Overview & Statistics',
    ),
    AdminMenuItem(
      icon: Icons.groups,
      title: 'Teams',
      subtitle: 'Manage Teams',
    ),
    AdminMenuItem(
      icon: Icons.person,
      title: 'Players',
      subtitle: 'Manage Players',
    ),
    AdminMenuItem(
      icon: Icons.sports_kabaddi,
      title: 'Matches',
      subtitle: 'Manage Matches',
    ),
    AdminMenuItem(
      icon: Icons.play_circle,
      title: 'OTT Management',
      subtitle: 'OTT Content',
    ),
    AdminMenuItem(
      icon: Icons.article,
      title: 'News',
      subtitle: 'Manage News',
    ),
    AdminMenuItem(
      icon: Icons.photo_library,
      title: 'Gallery',
      subtitle: 'Manage Gallery',
    ),
    AdminMenuItem(
      icon: Icons.notifications,
      title: 'Notifications',
      subtitle: 'Send Notifications',
    ),
    AdminMenuItem(
      icon: Icons.people,
      title: 'Users',
      subtitle: 'Manage Users',
    ),
    AdminMenuItem(
      icon: Icons.favorite,
      title: 'Fan Club',
      subtitle: 'Fan Club Members',
    ),
    AdminMenuItem(
      icon: Icons.business,
      title: 'Sponsors',
      subtitle: 'Manage Sponsors',
    ),
    AdminMenuItem(
      icon: Icons.video_library,
      title: 'Videos',
      subtitle: 'Manage Videos',
    ),
    AdminMenuItem(
      icon: Icons.emoji_events,
      title: 'Standings',
      subtitle: 'Team Standings',
    ),
    AdminMenuItem(
      icon: Icons.table_chart,
      title: 'Points Table',
      subtitle: 'Points Table',
    ),
    AdminMenuItem(
      icon: Icons.card_membership,
      title: 'Certificates',
      subtitle: 'Certificates',
    ),
    AdminMenuItem(
      icon: Icons.app_registration,
      title: 'Registrations',
      subtitle: 'Player Registrations',
    ),
    AdminMenuItem(
      icon: Icons.support_agent,
      title: 'Support',
      subtitle: 'Support Tickets',
    ),
    AdminMenuItem(
      icon: Icons.settings,
      title: 'Settings',
      subtitle: 'App Settings',
    ),
    AdminMenuItem(
      icon: Icons.list_alt,
      title: 'Logs',
      subtitle: 'System Logs',
    ),
    AdminMenuItem(
      icon: Icons.analytics,
      title: 'Analytics',
      subtitle: 'App Analytics',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: const Text(
          'Admin Dashboard',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () {
              _showLogoutDialog(context);
            },
          ),
        ],
      ),
      body: Row(
        children: [
          // Sidebar
          Container(
            width: 280,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF4C085D).withOpacity(0.5),
                  const Color(0xFF13051E).withOpacity(0.8),
                ],
              ),
              border: Border(
                right: BorderSide(
                  color: const Color(0xFF9333EA).withOpacity(0.3),
                ),
              ),
            ),
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 16),
              itemCount: _menuItems.length,
              itemBuilder: (context, index) {
                final item = _menuItems[index];
                return _buildSidebarItem(item, index);
              },
            ),
          ),
          // Main Content
          Expanded(
            child: _buildContent(),
          ),
        ],
      ),
    );
  }

  Widget _buildSidebarItem(AdminMenuItem item, int index) {
    final isSelected = _selectedIndex == index;
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        gradient: isSelected
            ? LinearGradient(
                colors: [
                  const Color(0xFF9333EA),
                  const Color(0xFFEC4899),
                ],
              )
            : null,
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        leading: Icon(
          item.icon,
          color: isSelected ? Colors.white : const Color(0xFF9333EA),
        ),
        title: Text(
          item.title,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.white70,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        subtitle: Text(
          item.subtitle,
          style: TextStyle(
            color: Colors.white.withOpacity(0.5),
            fontSize: 11,
          ),
        ),
        onTap: () {
          setState(() {
            _selectedIndex = index;
          });
        },
      ),
    ).animate().fadeIn(duration: 200.ms, delay: (index * 50).ms);
  }

  Widget _buildContent() {
    switch (_selectedIndex) {
      case 0:
        return _buildDashboard();
      case 1:
        return _buildTeamsManagement();
      case 2:
        return _buildPlayersManagement();
      case 3:
        return _buildMatchesManagement();
      case 4:
        return _buildOTTManagement();
      case 5:
        return _buildNewsManagement();
      case 6:
        return _buildGalleryManagement();
      case 7:
        return _buildNotificationsManagement();
      case 8:
        return _buildUsersManagement();
      case 9:
        return _buildFanClubManagement();
      case 10:
        return _buildSponsorsManagement();
      case 11:
        return _buildVideosManagement();
      case 12:
        return _buildStandingsManagement();
      case 13:
        return _buildPointsTableManagement();
      case 14:
        return _buildCertificatesManagement();
      case 15:
        return _buildRegistrationsManagement();
      case 16:
        return _buildSupportManagement();
      case 17:
        return _buildSettingsManagement();
      case 18:
        return _buildLogs();
      case 19:
        return _buildAnalytics();
      default:
        return _buildDashboard();
    }
  }

  Widget _buildDashboard() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Dashboard Overview',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ).animate().fadeIn(duration: 300.ms),
          const SizedBox(height: 24),
          // Stats Cards
          Row(
            children: [
              _buildStatCard('Total Teams', '6', Icons.groups, const Color(0xFF9333EA)),
              const SizedBox(width: 16),
              _buildStatCard('Total Players', '42', Icons.person, const Color(0xFFEC4899)),
            ],
          ).animate().fadeIn(duration: 300.ms, delay: 100.ms),
          const SizedBox(height: 16),
          Row(
            children: [
              _buildStatCard('Total Matches', '24', Icons.sports_kabaddi, const Color(0xFF4C085D)),
              const SizedBox(width: 16),
              _buildStatCard('Active Users', '1,234', Icons.people, const Color(0xFF9333EA)),
            ],
          ).animate().fadeIn(duration: 300.ms, delay: 200.ms),
          const SizedBox(height: 32),
          // Recent Activity
          const Text(
            'Recent Activity',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ).animate().fadeIn(duration: 300.ms, delay: 300.ms),
          const SizedBox(height: 16),
          _buildActivityItem('New player registered', '2 hours ago'),
          _buildActivityItem('Match score updated', '4 hours ago'),
          _buildActivityItem('News published', '6 hours ago'),
          _buildActivityItem('Gallery image added', '8 hours ago'),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.white.withOpacity(0.05),
              Colors.white.withOpacity(0.02),
            ],
          ),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: color.withOpacity(0.3),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 12),
            Text(
              value,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: TextStyle(
                color: Colors.white.withOpacity(0.6),
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActivityItem(String title, String time) {
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
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFF9333EA).withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.history,
              color: Color(0xFF9333EA),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  time,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.5),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 200.ms);
  }

  Widget _buildTeamsManagement() {
    return const AdminTeamsScreen();
  }

  Widget _buildPlayersManagement() {
    return const AdminPlayersScreen();
  }

  Widget _buildMatchesManagement() {
    return const AdminMatchesScreen();
  }

  Widget _buildOTTManagement() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'OTT Management',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 24),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 3,
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
            childAspectRatio: 1.5,
            children: [
              _buildOTTCard(Icons.live_tv, 'Live Match', () {}),
              _buildOTTCard(Icons.event, 'Upcoming Match', () {}),
              _buildOTTCard(Icons.check_circle, 'Completed Match', () {}),
              _buildOTTCard(Icons.replay, 'Replay', () {}),
              _buildOTTCard(Icons.star, 'Highlights', () {}),
              _buildOTTCard(Icons.tv, 'Shows', () {}),
              _buildOTTCard(Icons.mic, 'Interviews', () {}),
              _buildOTTCard(Icons.newspaper, 'Press Conferences', () {}),
              _buildOTTCard(Icons.verified, 'Exclusive Videos', () {}),
              _buildOTTCard(Icons.image, 'Banner', () {}),
              _buildOTTCard(Icons.settings, 'OTT Settings', () {}),
              _buildOTTCard(Icons.groups, 'Teams', () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const OTTTeamsScreen()),
                );
              }),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOTTCard(IconData icon, String title, VoidCallback onTap) {
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
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 40, color: const Color(0xFF9333EA)),
              const SizedBox(height: 12),
              Text(
                title,
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
      ),
    );
  }

  Widget _buildNewsManagement() {
    return const AdminNewsScreen();
  }

  Widget _buildGalleryManagement() {
    return const AdminGalleryScreen();
  }

  Widget _buildNotificationsManagement() {
    return const AdminNotificationsScreen();
  }

  Widget _buildUsersManagement() {
    return const AdminUsersScreen();
  }

  Widget _buildFanClubManagement() {
    return const AdminFanClubScreen();
  }

  Widget _buildSponsorsManagement() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.business,
            size: 80,
            color: Color(0xFF9333EA),
          ),
          const SizedBox(height: 24),
          const Text(
            'Sponsors Management',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Manage sponsors and partnerships',
            style: TextStyle(
              color: Colors.white.withOpacity(0.6),
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.add),
            label: const Text('Add Sponsor'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF9333EA),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVideosManagement() {
    return const AdminVideosScreen();
  }

  Widget _buildStandingsManagement() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.emoji_events,
            size: 80,
            color: Color(0xFF9333EA),
          ),
          const SizedBox(height: 24),
          const Text(
            'Standings Management',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Manage team standings',
            style: TextStyle(
              color: Colors.white.withOpacity(0.6),
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.edit),
            label: const Text('Update Standings'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF9333EA),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPointsTableManagement() {
    return const AdminPointsTableScreen();
  }

  Widget _buildRegistrationsManagement() {
    return const AdminRegistrationsScreen();
  }

  Widget _buildSupportManagement() {
    return const AdminSupportScreen();
  }

  Widget _buildSettingsManagement() {
    return const AdminSettingsScreen();
  }

  Widget _buildCertificatesManagement() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.card_membership,
            size: 80,
            color: Color(0xFF4C085D),
          ),
          const SizedBox(height: 24),
          const Text(
            'Certificates Management',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Manage player certificates',
            style: TextStyle(
              color: Colors.white.withOpacity(0.6),
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.add),
            label: const Text('Issue Certificate'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4C085D),
            ),
          ),
        ],
      ),
    );
  }



  Widget _buildAnalytics() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.analytics,
            size: 80,
            color: Color(0xFF9333EA),
          ),
          const SizedBox(height: 24),
          const Text(
            'App Analytics',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'View app usage analytics',
            style: TextStyle(
              color: Colors.white.withOpacity(0.6),
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.bar_chart),
            label: const Text('View Analytics'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF9333EA),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLogs() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.list_alt,
            size: 80,
            color: Color(0xFF4C085D),
          ),
          const SizedBox(height: 24),
          const Text(
            'System Logs',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'View system logs',
            style: TextStyle(
              color: Colors.white.withOpacity(0.6),
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E1E2E),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text(
          'Logout',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        content: const Text(
          'Are you sure you want to logout from admin panel?',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Color(0xFF9333EA)),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF9333EA),
            ),
            child: const Text(
              'Logout',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}

class AdminMenuItem {
  final IconData icon;
  final String title;
  final String subtitle;

  AdminMenuItem({
    required this.icon,
    required this.title,
    required this.subtitle,
  });
}
