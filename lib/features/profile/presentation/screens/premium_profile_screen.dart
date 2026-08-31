import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../../core/theme/theme_provider.dart';
import 'package:iwkl_app/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:iwkl_app/features/auth/presentation/bloc/auth_event.dart';
import 'package:iwkl_app/features/auth/presentation/bloc/auth_state.dart';
import 'package:iwkl_app/features/auth/domain/entities/user.dart';

class PremiumProfileScreen extends StatelessWidget {
  const PremiumProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDarkMode = themeProvider.isDarkMode;
    
    return Scaffold(
      backgroundColor: isDarkMode ? AppDesignSystem.primaryBackground : Colors.grey[100],
      body: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, authState) {
          if (authState is AuthAuthenticated) {
            return _buildProfile(context, authState.user, isDarkMode);
          }
          return _buildGuestProfile(context, isDarkMode);
        },
      ),
    );
  }

  Widget _buildProfile(BuildContext context, User user, bool isDarkMode) {
    return CustomScrollView(
      slivers: [
        // App Bar with Cover Image
        SliverAppBar(
          expandedHeight: 200,
          pinned: true,
          backgroundColor: Colors.transparent,
          flexibleSpace: FlexibleSpaceBar(
            background: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppDesignSystem.primaryPurple.withOpacity(0.8),
                    AppDesignSystem.gradientPurple.withOpacity(0.4),
                    AppDesignSystem.primaryBackground,
                  ],
                ),
              ),
              child: Stack(
                children: [
                  // Background Pattern
                  Positioned.fill(
                    child: Opacity(
                      opacity: 0.1,
                      child: Container(
                        decoration: const BoxDecoration(
                          image: DecorationImage(
                            image: AssetImage('assets/IWKL-FINAL-LOGO_2.png'),
                            fit: BoxFit.contain,
                            repeat: ImageRepeat.repeat,
                          ),
                        ),
                      ),
                    ),
                  ),
                  // Profile Image
                  Positioned(
                    bottom: 20,
                    left: 0,
                    right: 0,
                    child: Center(
                      child: Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            colors: [
                              AppDesignSystem.gold.withOpacity(0.3),
                              AppDesignSystem.softGold.withOpacity(0.1),
                              Colors.transparent,
                            ],
                          ),
                          border: Border.all(
                            color: AppDesignSystem.gold,
                            width: 3,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppDesignSystem.gold.withOpacity(0.4),
                              blurRadius: 30,
                              spreadRadius: 10,
                            ),
                          ],
                        ),
                        child: ClipOval(
                          child: user.avatar != null
                              ? Image.network(
                                  user.avatar!,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return const Icon(
                                      Icons.person,
                                      size: 60,
                                      color: AppDesignSystem.mutedText,
                                    );
                                  },
                                )
                              : const Icon(
                                  Icons.person,
                                  size: 60,
                                  color: AppDesignSystem.mutedText,
                                ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        // Content
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
            child: Column(
              children: [
                // User Name
                Text(
                  user.name,
                  style: AppDesignSystem.largeBoldTitle,
                  textAlign: TextAlign.center,
                ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                const SizedBox(height: AppDesignSystem.smSpacing),
                
                // Email
                Text(
                  user.email,
                  style: AppDesignSystem.elegantSubtitle,
                  textAlign: TextAlign.center,
                ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                const SizedBox(height: AppDesignSystem.lgSpacing),

                // Stats Row
                Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        icon: Icons.sports_kabaddi,
                        label: 'Matches',
                        value: '24',
                      ),
                    ),
                    const SizedBox(width: AppDesignSystem.mdSpacing),
                    Expanded(
                      child: _buildStatCard(
                        icon: Icons.favorite,
                        label: 'Following',
                        value: '12',
                      ),
                    ),
                    const SizedBox(width: AppDesignSystem.mdSpacing),
                    Expanded(
                      child: _buildStatCard(
                        icon: Icons.emoji_events,
                        label: 'Achievements',
                        value: '8',
                      ),
                    ),
                  ],
                ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                const SizedBox(height: AppDesignSystem.xlSpacing),

                // Premium Member Card
                PremiumCard(
                  isGoldBorder: true,
                  padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
                  child: Row(
                    children: [
                      Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          gradient: AppDesignSystem.goldGradient,
                          borderRadius: BorderRadius.circular(AppDesignSystem.mdRadius),
                        ),
                        child: const Icon(
                          Icons.workspace_premium,
                          size: 32,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(width: AppDesignSystem.mdSpacing),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Premium Member',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Valid until Dec 2026',
                              style: AppDesignSystem.softGreyCaption,
                            ),
                          ],
                        ),
                      ),
                      const Icon(
                        Icons.verified,
                        color: AppDesignSystem.gold,
                        size: 24,
                      ),
                    ],
                  ),
                ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                const SizedBox(height: AppDesignSystem.xlSpacing),

                // Quick Actions
                _buildSectionHeader('Quick Actions'),
                const SizedBox(height: AppDesignSystem.mdSpacing),
                _buildActionCard(
                  icon: Icons.edit,
                  title: 'Edit Profile',
                  subtitle: 'Update your information',
                  onTap: () {
                    // Navigate to edit profile
                  },
                ),
                _buildActionCard(
                  icon: Icons.bookmark,
                  title: 'Saved Items',
                  subtitle: 'View your saved content',
                  onTap: () {
                    // Navigate to saved items
                  },
                ),
                _buildActionCard(
                  icon: Icons.history,
                  title: 'Watch History',
                  subtitle: 'View your watch history',
                  onTap: () {
                    // Navigate to watch history
                  },
                ),
                const SizedBox(height: AppDesignSystem.xlSpacing),

                // Settings
                _buildSectionHeader('Settings'),
                const SizedBox(height: AppDesignSystem.mdSpacing),
                _buildActionCard(
                  icon: Icons.settings,
                  title: 'Settings',
                  subtitle: 'App preferences',
                  onTap: () => Navigator.pushNamed(context, '/settings'),
                ),
                _buildActionCard(
                  icon: Icons.help,
                  title: 'Help & Support',
                  subtitle: 'Get help and support',
                  onTap: () => Navigator.pushNamed(context, '/support'),
                ),
                const SizedBox(height: AppDesignSystem.xlSpacing),

                // Logout
                PremiumButton(
                  text: 'Logout',
                  onPressed: () {
                    context.read<AuthBloc>().add(LogoutEvent());
                    Navigator.pushReplacementNamed(context, '/login');
                  },
                  isSecondary: true,
                ),
                const SizedBox(height: AppDesignSystem.xlSpacing),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildGuestProfile(BuildContext context, bool isDarkMode) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.account_circle,
            size: 100,
            color: AppDesignSystem.mutedText,
          ),
          const SizedBox(height: AppDesignSystem.lgSpacing),
          const Text(
            'Not Logged In',
            style: AppDesignSystem.largeBoldTitle,
          ),
          const SizedBox(height: AppDesignSystem.smSpacing),
          Text(
            'Sign in to access your profile',
            style: AppDesignSystem.elegantSubtitle,
          ),
          const SizedBox(height: AppDesignSystem.xlSpacing),
          PremiumButton(
            text: 'Sign In',
            onPressed: () => Navigator.pushNamed(context, '/login'),
            isGold: true,
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return PremiumCard(
      padding: const EdgeInsets.all(AppDesignSystem.mdSpacing),
      child: Column(
        children: [
          Icon(icon, color: AppDesignSystem.primaryPurple, size: 28),
          const SizedBox(height: AppDesignSystem.smSpacing),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: AppDesignSystem.softGreyCaption,
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: AppDesignSystem.smSpacing),
      child: Text(
        title,
        style: AppDesignSystem.mediumSectionTitle,
      ),
    );
  }

  Widget _buildActionCard({
    required IconData icon,
    required String title,
    required String subtitle,
    VoidCallback? onTap,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppDesignSystem.mdSpacing),
      child: PremiumCard(
        onTap: onTap,
        padding: const EdgeInsets.all(AppDesignSystem.mdSpacing),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                gradient: AppDesignSystem.primaryGradient,
                borderRadius: BorderRadius.circular(AppDesignSystem.mdRadius),
              ),
              child: Icon(icon, color: Colors.white, size: 24),
            ),
            const SizedBox(width: AppDesignSystem.mdSpacing),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: AppDesignSystem.readableBody),
                  const SizedBox(height: 2),
                  Text(subtitle, style: AppDesignSystem.softGreyCaption),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios,
              color: AppDesignSystem.mutedText,
              size: 16,
            ),
          ],
        ),
      ),
    );
  }
}
