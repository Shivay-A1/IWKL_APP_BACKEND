import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/theme/admin_design_system.dart';
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

class PremiumAdminDashboardScreen extends StatefulWidget {
  const PremiumAdminDashboardScreen({super.key});

  @override
  State<PremiumAdminDashboardScreen> createState() => _PremiumAdminDashboardScreenState();
}

class _PremiumAdminDashboardScreenState extends State<PremiumAdminDashboardScreen> {
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
      subtitle: 'Fan Club',
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
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AdminDesignSystem.adminBackground,
      body: Row(
        children: [
          // Sidebar
          _buildSidebar(),
          // Main Content
          Expanded(
            child: _buildContent(),
          ),
        ],
      ),
    );
  }

  Widget _buildSidebar() {
    return Container(
      width: 280,
      decoration: BoxDecoration(
        color: AdminDesignSystem.adminSidebar,
        border: Border(
          right: BorderSide(color: AdminDesignSystem.adminBorder, width: 1),
        ),
      ),
      child: Column(
        children: [
          // Logo
          Padding(
            padding: const EdgeInsets.all(AdminDesignSystem.adminLg),
            child: Row(
              children: [
                Container(
                  width: 45,
                  height: 45,
                  decoration: BoxDecoration(
                    gradient: AdminDesignSystem.adminGradient,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.admin_panel_settings,
                    color: Colors.white,
                    size: 24,
                  ),
                ),
                const SizedBox(width: AdminDesignSystem.adminMd),
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'IWKL ADMIN',
                      style: TextStyle(
                        color: AdminDesignSystem.adminText,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'Panel',
                      style: TextStyle(
                        color: AdminDesignSystem.adminMuted,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Divider(color: AdminDesignSystem.adminBorder),
          // Menu Items
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: AdminDesignSystem.adminSm),
              itemCount: _menuItems.length,
              itemBuilder: (context, index) {
                final item = _menuItems[index];
                final isSelected = _selectedIndex == index;
                return _buildMenuItem(item, index, isSelected);
              },
            ),
          ),
          // Logout
          Padding(
            padding: const EdgeInsets.all(AdminDesignSystem.adminLg),
            child: ListTile(
              leading: const Icon(Icons.logout, color: AdminDesignSystem.adminError),
              title: const Text(
                'Logout',
                style: TextStyle(color: AdminDesignSystem.adminText),
              ),
              onTap: () {
                Navigator.pushReplacementNamed(context, '/login');
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuItem(AdminMenuItem item, int index, bool isSelected) {
    return Container(
      margin: const EdgeInsets.symmetric(
        horizontal: AdminDesignSystem.adminMd,
        vertical: 2,
      ),
      decoration: BoxDecoration(
        gradient: isSelected ? AdminDesignSystem.adminGradient : null,
        borderRadius: BorderRadius.circular(8),
      ),
      child: ListTile(
        leading: Icon(
          item.icon,
          color: isSelected ? Colors.white : AdminDesignSystem.adminMuted,
          size: 20,
        ),
        title: Text(
          item.title,
          style: TextStyle(
            color: isSelected ? Colors.white : AdminDesignSystem.adminText,
            fontSize: 14,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        subtitle: Text(
          item.subtitle,
          style: TextStyle(
            color: isSelected ? Colors.white70 : AdminDesignSystem.adminMuted,
            fontSize: 11,
          ),
        ),
        onTap: () {
          setState(() => _selectedIndex = index);
        },
      ),
    );
  }

  Widget _buildContent() {
    return Column(
      children: [
        // Header
        _buildHeader(),
        // Content Area
        Expanded(
          child: _buildSelectedContent(),
        ),
      ],
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(AdminDesignSystem.adminLg),
      decoration: BoxDecoration(
        color: AdminDesignSystem.adminCard,
        border: Border(
          bottom: BorderSide(color: AdminDesignSystem.adminBorder, width: 1),
        ),
      ),
      child: Row(
        children: [
          Text(
            _menuItems[_selectedIndex].title,
            style: AdminDesignSystem.adminTitle,
          ),
          const Spacer(),
          // User Profile
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: AdminDesignSystem.adminGradient,
                ),
                child: const Icon(Icons.person, color: Colors.white, size: 20),
              ),
              const SizedBox(width: AdminDesignSystem.adminMd),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Admin User',
                    style: TextStyle(
                      color: AdminDesignSystem.adminText,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    'Super Admin',
                    style: TextStyle(
                      color: AdminDesignSystem.adminMuted,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSelectedContent() {
    switch (_selectedIndex) {
      case 0:
        return _buildDashboardOverview();
      case 1:
        return const AdminTeamsScreen();
      case 2:
        return const AdminPlayersScreen();
      case 3:
        return const AdminMatchesScreen();
      case 4:
        return _buildOTTManagement();
      case 5:
        return const AdminNewsScreen();
      case 6:
        return const AdminGalleryScreen();
      case 7:
        return const AdminNotificationsScreen();
      case 8:
        return const AdminUsersScreen();
      case 9:
        return _buildFanClubManagement();
      case 10:
        return _buildSponsorsManagement();
      case 11:
        return const AdminVideosScreen();
      case 12:
        return _buildStandingsManagement();
      case 13:
        return const AdminPointsTableScreen();
      case 14:
        return const AdminRegistrationsScreen();
      case 15:
        return const AdminSupportScreen();
      case 16:
        return const AdminSettingsScreen();
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildDashboardOverview() {
    return Padding(
      padding: const EdgeInsets.all(AdminDesignSystem.adminLg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Stats Cards
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  title: 'Total Teams',
                  value: '9',
                  icon: Icons.groups,
                  color: AdminDesignSystem.adminPrimary,
                ),
              ),
              const SizedBox(width: AdminDesignSystem.adminMd),
              Expanded(
                child: _buildStatCard(
                  title: 'Total Players',
                  value: '126',
                  icon: Icons.person,
                  color: AdminDesignSystem.adminSuccess,
                ),
              ),
              const SizedBox(width: AdminDesignSystem.adminMd),
              Expanded(
                child: _buildStatCard(
                  title: 'Total Matches',
                  value: '45',
                  icon: Icons.sports_kabaddi,
                  color: AdminDesignSystem.adminWarning,
                ),
              ),
              const SizedBox(width: AdminDesignSystem.adminMd),
              Expanded(
                child: _buildStatCard(
                  title: 'Active Users',
                  value: '2.4K',
                  icon: Icons.people,
                  color: AdminDesignSystem.adminSecondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: AdminDesignSystem.adminXl),
          // Recent Activity
          Text(
            'Recent Activity',
            style: AdminDesignSystem.adminSubtitle,
          ),
          const SizedBox(height: AdminDesignSystem.adminMd),
          Container(
            decoration: AdminDesignSystem.adminCardDecoration,
            child: ListView(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildActivityItem('New player registration approved', '2 hours ago'),
                _buildActivityItem('Match schedule updated', '4 hours ago'),
                _buildActivityItem('News article published', '6 hours ago'),
                _buildActivityItem('User support ticket resolved', '8 hours ago'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(AdminDesignSystem.adminLg),
      decoration: AdminDesignSystem.adminCardDecoration,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 32),
          const SizedBox(height: AdminDesignSystem.adminSm),
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
            style: AdminDesignSystem.adminCaption,
          ),
        ],
      ),
    );
  }

  Widget _buildActivityItem(String title, String time) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: AdminDesignSystem.adminPrimary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(Icons.check_circle, color: AdminDesignSystem.adminSuccess, size: 20),
      ),
      title: Text(
        title,
        style: AdminDesignSystem.adminBody,
      ),
      subtitle: Text(
        time,
        style: AdminDesignSystem.adminCaption,
      ),
    );
  }

  Widget _buildOTTManagement() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.play_circle, size: 80, color: AdminDesignSystem.adminPrimary),
          SizedBox(height: AdminDesignSystem.adminLg),
          Text(
            'OTT Management',
            style: AdminDesignSystem.adminTitle,
          ),
          SizedBox(height: AdminDesignSystem.adminSm),
          Text(
            'Manage video content, live streams, and media',
            style: AdminDesignSystem.adminCaption,
          ),
        ],
      ),
    );
  }

  Widget _buildFanClubManagement() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.favorite, size: 80, color: AdminDesignSystem.adminError),
          SizedBox(height: AdminDesignSystem.adminLg),
          Text(
            'Fan Club Management',
            style: AdminDesignSystem.adminTitle,
          ),
        ],
      ),
    );
  }

  Widget _buildSponsorsManagement() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.business, size: 80, color: AdminDesignSystem.adminSuccess),
          SizedBox(height: AdminDesignSystem.adminLg),
          Text(
            'Sponsors Management',
            style: AdminDesignSystem.adminTitle,
          ),
        ],
      ),
    );
  }

  Widget _buildStandingsManagement() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.emoji_events, size: 80, color: AdminDesignSystem.adminWarning),
          SizedBox(height: AdminDesignSystem.adminLg),
          Text(
            'Standings Management',
            style: AdminDesignSystem.adminTitle,
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
