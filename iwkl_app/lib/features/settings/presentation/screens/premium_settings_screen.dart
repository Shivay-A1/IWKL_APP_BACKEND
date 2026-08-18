import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/theme/theme_provider.dart';
import '../../../../core/widgets/premium_widgets.dart';
import 'package:iwkl_app/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:iwkl_app/features/auth/presentation/bloc/auth_event.dart';
import 'package:iwkl_app/features/auth/presentation/bloc/auth_state.dart';

class PremiumSettingsScreen extends StatelessWidget {
  const PremiumSettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDarkMode = themeProvider.isDarkMode;

    return Scaffold(
      backgroundColor: isDarkMode ? AppDesignSystem.primaryBackground : Colors.grey[100],
      appBar: AppBar(
        backgroundColor: isDarkMode ? Colors.transparent : Colors.grey[100],
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: isDarkMode ? Colors.white : Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Settings',
          style: TextStyle(
            color: isDarkMode ? Colors.white : Colors.black,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, authState) {
          return ListView(
            padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
            children: [
              // Account Section
              _buildSectionHeader('Account', isDarkMode),
              const SizedBox(height: AppDesignSystem.mdSpacing),
              _buildSettingsCard(
                icon: Icons.person,
                title: 'Profile',
                subtitle: 'View your profile',
                onTap: () => Navigator.pushNamed(context, '/profile'),
                isDarkMode: isDarkMode,
              ),
              _buildSettingsCard(
                icon: Icons.edit,
                title: 'Edit Profile',
                subtitle: 'Update your information',
                onTap: () {
                  // Navigate to edit profile
                },
                isDarkMode: isDarkMode,
              ),
              const SizedBox(height: AppDesignSystem.xlSpacing),

              // Preferences Section
              _buildSectionHeader('Preferences', isDarkMode),
              const SizedBox(height: AppDesignSystem.mdSpacing),
              _buildSettingsCard(
                icon: Icons.notifications,
                title: 'Notifications',
                subtitle: 'Manage notification settings',
                onTap: () {
                  // Navigate to notification settings
                },
                isDarkMode: isDarkMode,
              ),
              _buildSettingsCard(
                icon: Icons.language,
                title: 'Language',
                subtitle: 'English',
                onTap: () {
                  // Show language selector
                },
                isDarkMode: isDarkMode,
              ),
              _buildSettingsCard(
                icon: Icons.dark_mode,
                title: 'Dark Mode',
                subtitle: isDarkMode ? 'Currently enabled' : 'Currently disabled',
                trailing: Switch(
                  value: isDarkMode,
                  onChanged: themeProvider.toggleTheme,
                  activeColor: AppDesignSystem.primaryPurple,
                ),
                isDarkMode: isDarkMode,
              ),
              const SizedBox(height: AppDesignSystem.xlSpacing),

              // Legal Section
              _buildSectionHeader('Legal', isDarkMode),
              const SizedBox(height: AppDesignSystem.mdSpacing),
              _buildSettingsCard(
                icon: Icons.privacy_tip,
                title: 'Privacy Policy',
                subtitle: 'Read our privacy policy',
                onTap: () {
                  // Show privacy policy
                },
                isDarkMode: isDarkMode,
              ),
              _buildSettingsCard(
                icon: Icons.description,
                title: 'Terms of Service',
                subtitle: 'Read our terms of service',
                onTap: () {
                  // Show terms of service
                },
                isDarkMode: isDarkMode,
              ),
              const SizedBox(height: AppDesignSystem.xlSpacing),

              // About Section
              _buildSectionHeader('About', isDarkMode),
              const SizedBox(height: AppDesignSystem.mdSpacing),
              _buildSettingsCard(
                icon: Icons.info,
                title: 'About IWKL',
                subtitle: 'Version 1.0.0',
                onTap: () {
                  // Show about
                },
                isDarkMode: isDarkMode,
              ),
              _buildSettingsCard(
                icon: Icons.support_agent,
                title: 'Support',
                subtitle: 'Get help and support',
                onTap: () => Navigator.pushNamed(context, '/support'),
                isDarkMode: isDarkMode,
              ),
              const SizedBox(height: AppDesignSystem.xlSpacing),

              // Logout Button
              if (authState is AuthAuthenticated)
                PremiumButton(
                  text: 'Logout',
                  onPressed: () {
                    context.read<AuthBloc>().add(LogoutEvent());
                    Navigator.pushReplacementNamed(context, '/login');
                  },
                  isSecondary: true,
                ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildSectionHeader(String title, bool isDarkMode) {
    return Padding(
      padding: const EdgeInsets.only(left: AppDesignSystem.smSpacing),
      child: Text(
        title,
        style: TextStyle(
          color: isDarkMode ? Colors.white : Colors.black,
          fontSize: 18,
          fontWeight: FontWeight.bold,
          letterSpacing: 1,
        ),
      ).animate().fadeIn(duration: AppDesignSystem.fastAnimation),
    );
  }

  Widget _buildSettingsCard({
    required IconData icon,
    required String title,
    required String subtitle,
    VoidCallback? onTap,
    Widget? trailing,
    required bool isDarkMode,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppDesignSystem.mdSpacing),
      child: Container(
        decoration: BoxDecoration(
          gradient: isDarkMode 
              ? LinearGradient(
                  colors: [
                    Colors.white.withOpacity(0.05),
                    Colors.white.withOpacity(0.02),
                  ],
                )
              : LinearGradient(
                  colors: [
                    Colors.white,
                    Colors.grey[50]!,
                  ],
                ),
          borderRadius: BorderRadius.circular(AppDesignSystem.mdRadius),
          border: Border.all(
            color: isDarkMode 
                ? Colors.white.withOpacity(0.1)
                : Colors.grey[300]!,
          ),
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(AppDesignSystem.mdRadius),
            child: Padding(
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
                    child: Icon(
                      icon,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: AppDesignSystem.mdSpacing),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: TextStyle(
                            color: isDarkMode ? Colors.white : Colors.black,
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          subtitle,
                          style: TextStyle(
                            color: isDarkMode 
                                ? AppDesignSystem.mutedText 
                                : Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (trailing != null) trailing,
                  if (trailing == null)
                    Icon(
                      Icons.arrow_forward_ios,
                      color: isDarkMode ? AppDesignSystem.mutedText : Colors.grey[600],
                      size: 16,
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
