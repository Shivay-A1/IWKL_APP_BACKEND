import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:iwkl_app/core/constants/app_constants.dart';
import 'package:iwkl_app/core/widgets/glass_card.dart';
import 'package:iwkl_app/core/widgets/premium_app_bar.dart';

class ProfileScreen extends StatelessWidget {
  final UserProfileData user;

  const ProfileScreen({
    super.key,
    required this.user,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Custom AppBar
          SliverAppBar(
            expandedHeight: 250,
            pinned: true,
            backgroundColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      const Color(AppConstants.primaryColorValue),
                      const Color(AppConstants.secondaryColorValue),
                      const Color(AppConstants.backgroundColorValue),
                    ],
                  ),
                ),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Profile Image with Glow
                      Stack(
                        children: [
                          Container(
                            width: 100,
                            height: 100,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(
                                colors: [
                                  Color(AppConstants.accentColorValue),
                                  Color(AppConstants.accentColorValue).withOpacity(0.7),
                                ],
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Color(AppConstants.accentColorValue).withOpacity(0.5),
                                  blurRadius: 30,
                                  spreadRadius: 10,
                                ),
                              ],
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(4),
                              child: ClipOval(
                                child: user.avatar != null
                                    ? CachedNetworkImage(
                                        imageUrl: user.avatar!,
                                        fit: BoxFit.cover,
                                        placeholder: (context, url) => Container(
                                          color: Colors.grey,
                                          child: const Icon(Icons.person, color: Colors.white54),
                                        ),
                                        errorWidget: (context, url, error) => Container(
                                          color: Colors.grey,
                                          child: const Icon(Icons.person, color: Colors.white54),
                                        ),
                                      )
                                    : Container(
                                        color: Colors.grey,
                                        child: const Icon(Icons.person, color: Colors.white54),
                                      ),
                              ),
                            ),
                          ),
                          if (user.isPremium)
                            Positioned(
                              bottom: 0,
                              right: 0,
                              child: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Color(AppConstants.accentColorValue),
                                  shape: BoxShape.circle,
                                  border: Border.all(color: Colors.white, width: 2),
                                ),
                                child: const Icon(
                                  Icons.workspace_premium,
                                  size: 20,
                                  color: Colors.black,
                                ),
                              ).animate().scale(duration: 300.ms, curve: Curves.elasticOut),
                            ),
                        ],
                      ).animate().scale(duration: 500.ms, curve: Curves.elasticOut),
                      const SizedBox(height: 16),
                      
                      // User Name
                      Text(
                        user.name,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          shadows: [
                            Shadow(
                              color: Colors.black,
                              blurRadius: 10,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 8),
                      
                      // Email
                      Text(
                        user.email,
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.7),
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 8),
                      
                      // Premium Badge
                      if (user.isPremium)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Color(AppConstants.accentColorValue),
                                Color(AppConstants.accentColorValue).withOpacity(0.7),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Color(AppConstants.accentColorValue).withOpacity(0.5),
                                blurRadius: 10,
                                spreadRadius: 2,
                              ),
                            ],
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.workspace_premium, size: 16, color: Colors.black),
                              SizedBox(width: 6),
                              Text(
                                'Premium Member',
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ).animate().fadeIn(delay: 200.ms).scale(),
                    ],
                  ),
                ),
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
                  // Stats Row
                  _buildStatsRow(context),
                  const SizedBox(height: 24),

                  // Favorite Team
                  if (user.favoriteTeam != null)
                    _buildFavoriteTeam(context),
                  const SizedBox(height: 24),

                  // Settings Section
                  _buildSettingsSection(context),
                  const SizedBox(height: 24),

                  // Achievements
                  _buildAchievements(context),
                  const SizedBox(height: 24),

                  // Logout Button
                  _buildLogoutButton(context),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsRow(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: GlassCard(
            padding: const EdgeInsets.all(20),
            borderRadius: BorderRadius.circular(16),
            child: Column(
              children: [
                const Icon(Icons.emoji_events, color: Color(AppConstants.accentColorValue), size: 32),
                const SizedBox(height: 8),
                Text(
                  '${user.achievements.length}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Achievements',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.6),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: GlassCard(
            padding: const EdgeInsets.all(20),
            borderRadius: BorderRadius.circular(16),
            child: Column(
              children: [
                const Icon(Icons.favorite, color: Colors.red, size: 32),
                const SizedBox(height: 8),
                Text(
                  '${user.favoriteCount}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Favorites',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.6),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    ).animate().fadeIn().slideY(begin: 0.2);
  }

  Widget _buildFavoriteTeam(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(20),
      borderRadius: BorderRadius.circular(16),
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: Color(AppConstants.accentColorValue),
                width: 2,
              ),
            ),
            child: ClipOval(
              child: user.favoriteTeam?.logo != null
                  ? Image.asset(user.favoriteTeam!.logo!, fit: BoxFit.cover)
                  : const Icon(Icons.sports_cricket, color: Colors.white54),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Favorite Team',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  user.favoriteTeam?.name ?? 'Not Set',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.edit, color: Color(AppConstants.accentColorValue)),
            onPressed: () {},
          ),
        ],
      ),
    ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.2);
  }

  Widget _buildSettingsSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Settings',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        GlassCard(
          borderRadius: BorderRadius.circular(16),
          child: Column(
            children: [
              _buildSettingItem(
                Icons.language,
                'Language',
                user.language ?? 'English',
                () {},
              ),
              const Divider(color: Colors.white24),
              _buildSettingItem(
                Icons.palette,
                'Theme',
                user.theme ?? 'Dark',
                () {},
              ),
              const Divider(color: Colors.white24),
              _buildSettingItem(
                Icons.notifications,
                'Notifications',
                user.notificationsEnabled ? 'On' : 'Off',
                () {},
              ),
              const Divider(color: Colors.white24),
              _buildSettingItem(
                Icons.edit,
                'Edit Profile',
                'Update your documents',
                () => _showEditProfileModal(context),
              ),
            ],
          ),
        ),
      ],
    ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.2);
  }

  Widget _buildSettingItem(IconData icon, String title, String value, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: Colors.white),
      title: Text(
        title,
        style: const TextStyle(color: Colors.white),
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            value,
            style: TextStyle(
              color: Colors.white.withOpacity(0.6),
            ),
          ),
          const SizedBox(width: 8),
          const Icon(Icons.chevron_right, color: Colors.white54),
        ],
      ),
      onTap: onTap,
    );
  }

  Widget _buildAchievements(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Achievements',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 100,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: user.achievements.length,
            itemBuilder: (context, index) {
              final achievement = user.achievements[index];
              return Padding(
                padding: const EdgeInsets.only(right: 12),
                child: GlassCard(
                  padding: const EdgeInsets.all(16),
                  borderRadius: BorderRadius.circular(12),
                  child: Column(
                    children: [
                      Icon(
                        achievement.icon,
                        color: Color(AppConstants.accentColorValue),
                        size: 32,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        achievement.title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
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

  Widget _buildLogoutButton(BuildContext context) {
    return GlassCard(
      onTap: () {},
      padding: const EdgeInsets.symmetric(vertical: 20),
      borderRadius: BorderRadius.circular(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.logout, color: Colors.white),
          const SizedBox(width: 12),
          const Text(
            'Logout',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.2);
  }

  void _showEditProfileModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.9,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              const Color(AppConstants.primaryColorValue),
              const Color(AppConstants.secondaryColorValue),
              const Color(AppConstants.backgroundColorValue),
            ],
          ),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const Expanded(
                    child: Text(
                      'Edit Profile Documents',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            const Divider(color: Colors.white24),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Read-only user info
                    _buildReadOnlyField('Name', user.name),
                    _buildReadOnlyField('Email', user.email),
                    const SizedBox(height: 24),
                    
                    // Editable documents
                    const Text(
                      'Documents',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    _buildDocumentItem(
                      'Profile Photo',
                      user.avatar,
                      Icons.person,
                      () => _showDocumentOptions(context, 'photo', user.avatar),
                    ),
                    _buildDocumentItem(
                      'Aadhaar Card',
                      null,
                      Icons.card_membership,
                      () => _showDocumentOptions(context, 'aadhaar', null),
                    ),
                    _buildDocumentItem(
                      'Age Proof',
                      null,
                      Icons.badge,
                      () => _showDocumentOptions(context, 'ageProof', null),
                    ),
                    _buildDocumentItem(
                      'Sports Certificate',
                      null,
                      Icons.emoji_events,
                      () => _showDocumentOptions(context, 'sportsCertificate', null),
                    ),
                    _buildDocumentItem(
                      'Medical Certificate',
                      null,
                      Icons.local_hospital,
                      () => _showDocumentOptions(context, 'medicalCertificate', null),
                    ),
                    _buildDocumentItem(
                      'Signature',
                      null,
                      Icons.draw,
                      () => _showDocumentOptions(context, 'signature', null),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReadOnlyField(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              color: Colors.white.withOpacity(0.6),
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDocumentItem(String title, String? url, IconData icon, VoidCallback onTap) {
    return GlassCard(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      borderRadius: BorderRadius.circular(12),
      onTap: onTap,
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Color(AppConstants.accentColorValue),
                  Color(AppConstants.accentColorValue).withOpacity(0.7),
                ],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: Colors.black),
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
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  url != null ? 'Uploaded' : 'Not uploaded',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.5),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: Colors.white54),
        ],
      ),
    );
  }

  void _showDocumentOptions(BuildContext context, String documentType, String? currentUrl) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              const Color(AppConstants.primaryColorValue),
              const Color(AppConstants.secondaryColorValue),
              const Color(AppConstants.backgroundColorValue),
            ],
          ),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'Document Options',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const Divider(color: Colors.white24),
              if (currentUrl != null) ...[
                ListTile(
                  leading: const Icon(Icons.visibility, color: Colors.white),
                  title: const Text(
                    'View',
                    style: TextStyle(color: Colors.white),
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    _viewDocument(currentUrl);
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.download, color: Colors.white),
                  title: const Text(
                    'Download',
                    style: TextStyle(color: Colors.white),
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    _downloadDocument(currentUrl);
                  },
                ),
                const Divider(color: Colors.white24),
              ],
              ListTile(
                leading: const Icon(Icons.refresh, color: Colors.white),
                title: const Text(
                  'Replace',
                  style: TextStyle(color: Colors.white),
                ),
                onTap: () {
                  Navigator.pop(context);
                  _replaceDocument(context, documentType);
                },
              ),
              ListTile(
                leading: const Icon(Icons.cancel, color: Colors.white),
                title: const Text(
                  'Cancel',
                  style: TextStyle(color: Colors.white),
                ),
                onTap: () => Navigator.pop(context),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _viewDocument(String url) {
    // TODO: Implement document viewing
    print('View document: $url');
  }

  void _downloadDocument(String url) {
    // TODO: Implement document downloading
    print('Download document: $url');
  }

  void _replaceDocument(BuildContext context, String documentType) {
    // TODO: Implement document replacement with file picker
    print('Replace document: $documentType');
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('File picker will be implemented')),
    );
  }
}

class UserProfileData {
  final String name;
  final String email;
  final String? avatar;
  final bool isPremium;
  final String? language;
  final String? theme;
  final bool notificationsEnabled;
  final int favoriteCount;
  final FavoriteTeam? favoriteTeam;
  final List<Achievement> achievements;

  UserProfileData({
    required this.name,
    required this.email,
    this.avatar,
    required this.isPremium,
    this.language,
    this.theme,
    required this.notificationsEnabled,
    required this.favoriteCount,
    this.favoriteTeam,
    required this.achievements,
  });
}

class FavoriteTeam {
  final String name;
  final String? logo;

  FavoriteTeam({
    required this.name,
    this.logo,
  });
}

class Achievement {
  final IconData icon;
  final String title;

  Achievement({
    required this.icon,
    required this.title,
  });
}
