import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';
import '../theme/app_design_system.dart';
import '../widgets/premium_widgets.dart';
import '../theme/theme_provider.dart';
import '../../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../../features/auth/presentation/bloc/auth_event.dart';
import '../../../features/auth/presentation/bloc/auth_state.dart';
import '../../../features/auth/domain/entities/user.dart';

class PremiumDrawer extends StatelessWidget {
  const PremiumDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDarkMode = themeProvider.isDarkMode;
    
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, authState) {
        final User? user = authState is AuthAuthenticated ? authState.user : null;
        
        return Drawer(
          backgroundColor: isDarkMode ? AppDesignSystem.cardBackground : Colors.white,
          child: Column(
            children: [
              // Drawer Header
              _buildDrawerHeader(user, isDarkMode),
              const Divider(color: AppDesignSystem.divider),
              // Menu Items
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(vertical: AppDesignSystem.mdSpacing),
                  children: [
                    _buildMenuItem(
                      icon: Icons.home,
                      title: 'Home',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushReplacementNamed(context, '/home');
                      },
                      isDarkMode: isDarkMode,
                    ),
                    _buildMenuItem(
                      icon: Icons.play_circle,
                      title: 'Live Matches',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/live-match');
                      },
                      isDarkMode: isDarkMode,
                    ),
                    _buildMenuItem(
                      icon: Icons.play_arrow,
                      title: 'OTT',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/ott');
                      },
                      isDarkMode: isDarkMode,
                    ),
                    _buildMenuItem(
                      icon: Icons.groups,
                      title: 'Teams',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/teams');
                      },
                      isDarkMode: isDarkMode,
                    ),
                    _buildMenuItem(
                      icon: Icons.table_chart,
                      title: 'Points Table',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/points-table');
                      },
                      isDarkMode: isDarkMode,
                    ),
                    _buildMenuItem(
                      icon: Icons.calendar_today,
                      title: 'Schedule',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/schedule');
                      },
                      isDarkMode: isDarkMode,
                    ),
                    _buildMenuItem(
                      icon: Icons.photo_library,
                      title: 'Gallery',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/gallery');
                      },
                      isDarkMode: isDarkMode,
                    ),
                    _buildMenuItem(
                      icon: Icons.article,
                      title: 'News',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/news');
                      },
                      isDarkMode: isDarkMode,
                    ),
                    _buildMenuItem(
                      icon: Icons.emoji_events,
                      title: 'Fan Club',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/fan-club');
                      },
                      isDarkMode: isDarkMode,
                    ),
                    const Divider(color: AppDesignSystem.divider),
                    _buildMenuItem(
                      icon: Icons.person,
                      title: 'Profile',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/profile');
                      },
                      isDarkMode: isDarkMode,
                    ),
                    _buildMenuItem(
                      icon: Icons.settings,
                      title: 'Settings',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/settings');
                      },
                      isDarkMode: isDarkMode,
                    ),
                    _buildMenuItem(
                      icon: Icons.support_agent,
                      title: 'Support',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/support');
                      },
                      isDarkMode: isDarkMode,
                    ),
                  ],
                ),
              ),
              // Logout Button
              Padding(
                padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
                child: authState is AuthAuthenticated
                    ? PremiumButton(
                        text: 'Logout',
                        onPressed: () {
                          context.read<AuthBloc>().add(LogoutEvent());
                          Navigator.pop(context);
                          Navigator.pushReplacementNamed(context, '/login');
                        },
                        isSecondary: true,
                      )
                    : PremiumButton(
                        text: 'Login',
                        onPressed: () {
                          Navigator.pop(context);
                          Navigator.pushNamed(context, '/login');
                        },
                        isGold: true,
                      ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDrawerHeader(User? user, bool isDarkMode) {
    return Container(
      padding: const EdgeInsets.all(AppDesignSystem.xlSpacing),
      decoration: BoxDecoration(
        gradient: isDarkMode
            ? LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppDesignSystem.primaryPurple.withValues(alpha: 0.2),
                  AppDesignSystem.gradientPurple.withValues(alpha: 0.1),
                ],
              )
            : LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.grey[200]!,
                  Colors.grey[100]!,
                ],
              ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: AppDesignSystem.mdSpacing),
          // Logo
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: AppDesignSystem.gold.withValues(alpha: 0.5),
                width: 2,
              ),
            ),
            child: Image.asset(
              'assets/IWKL-FINAL-LOGO_2.png',
              errorBuilder: (context, error, stackTrace) {
                return const Icon(Icons.sports_kabaddi, size: 40, color: AppDesignSystem.gold);
              },
            ),
          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).scale(
            begin: const Offset(0.8, 0.8),
            end: const Offset(1, 1),
            curve: AppDesignSystem.elasticCurve,
          ),
          const SizedBox(height: AppDesignSystem.lgSpacing),
          // App Name
          Text(
            'IWKL OFFICIAL APP',
            style: AppDesignSystem.largeBoldTitle.copyWith(
              color: isDarkMode ? Colors.white : Colors.black87,
            ),
          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
          const SizedBox(height: AppDesignSystem.smSpacing),
          // User Info
          if (user != null) ...[
            Text(
              'Welcome, ${user.name}',
              style: AppDesignSystem.elegantSubtitle.copyWith(
                color: isDarkMode ? Colors.white70 : Colors.black54,
              ),
            ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
            const SizedBox(height: AppDesignSystem.smSpacing),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                gradient: AppDesignSystem.primaryGradient,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Text(
                user.email,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
          ] else ...[
            Text(
              'Sign in to access all features',
              style: AppDesignSystem.elegantSubtitle.copyWith(
                color: isDarkMode ? Colors.white70 : Colors.black54,
              ),
            ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
          ],
        ],
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    required bool isDarkMode,
  }) {
    return ListTile(
      leading: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: AppDesignSystem.primaryGradient,
          boxShadow: [
            BoxShadow(
              color: AppDesignSystem.primaryPurple.withValues(alpha: 0.3),
              blurRadius: 8,
            ),
          ],
        ),
        child: Icon(
          icon,
          color: Colors.white,
          size: 22,
        ),
      ),
      title: Text(
        title,
        style: TextStyle(
          color: isDarkMode ? Colors.white : Colors.black87,
          fontSize: 16,
          fontWeight: FontWeight.w600,
        ),
      ),
      trailing: Icon(
        Icons.chevron_right,
        color: isDarkMode ? AppDesignSystem.secondaryText : Colors.grey[600],
        size: 24,
      ),
      onTap: onTap,
    ).animate().fadeIn(duration: AppDesignSystem.fastAnimation).slideX(
      begin: -0.2,
      end: 0,
      curve: AppDesignSystem.smoothCurve,
    );
  }
}
