import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../../core/theme/theme_provider.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  // TODO: Load settings from API
  bool enableNotifications = true;
  bool enableMatchAlerts = true;
  bool enableNewsAlerts = true;
  String language = 'en';
  String theme = 'light';

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDarkMode = themeProvider.isDarkMode;

    return Scaffold(
      backgroundColor: isDarkMode ? AppDesignSystem.primaryBackground : Colors.grey[100],
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'Settings',
          style: AppDesignSystem.appBarTitle,
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppDesignSystem.gold),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Container(
            decoration: BoxDecoration(
              gradient: isDarkMode
                  ? const LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [AppDesignSystem.primaryBackground, Color(0xFF0A0510)],
                    )
                  : null,
            ),
            child: Padding(
              padding: const EdgeInsets.all(AppDesignSystem.xlSpacing),
              child: Column(
                children: [
                  // Notifications Section
                  _buildSectionHeader('Notifications').animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                  const SizedBox(height: AppDesignSystem.mdSpacing),

                  _buildSwitchOption(
                    icon: Icons.notifications,
                    title: 'Enable Notifications',
                    value: enableNotifications,
                    onChanged: (value) {
                      setState(() {
                        enableNotifications = value;
                      });
                      // TODO: Save to API
                    },
                  ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
                    begin: -0.3,
                    end: 0,
                    curve: AppDesignSystem.smoothCurve,
                  ),
                  const SizedBox(height: AppDesignSystem.mdSpacing),

                  _buildSwitchOption(
                    icon: Icons.sports,
                    title: 'Match Alerts',
                    value: enableMatchAlerts,
                    onChanged: (value) {
                      setState(() {
                        enableMatchAlerts = value;
                      });
                      // TODO: Save to API
                    },
                  ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
                    begin: -0.3,
                    end: 0,
                    curve: AppDesignSystem.smoothCurve,
                  ),
                  const SizedBox(height: AppDesignSystem.mdSpacing),

                  _buildSwitchOption(
                    icon: Icons.article,
                    title: 'News Alerts',
                    value: enableNewsAlerts,
                    onChanged: (value) {
                      setState(() {
                        enableNewsAlerts = value;
                      });
                      // TODO: Save to API
                    },
                  ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
                    begin: -0.3,
                    end: 0,
                    curve: AppDesignSystem.smoothCurve,
                  ),
                  const SizedBox(height: AppDesignSystem.xlSpacing),

                  // Preferences Section
                  _buildSectionHeader('Preferences').animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                  const SizedBox(height: AppDesignSystem.mdSpacing),

                  _buildDropdownOption(
                    icon: Icons.language,
                    title: 'Language',
                    value: language,
                    options: const ['en', 'hi'],
                    onChanged: (value) {
                      setState(() {
                        language = value;
                      });
                      // TODO: Save to API
                    },
                  ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
                    begin: -0.3,
                    end: 0,
                    curve: AppDesignSystem.smoothCurve,
                  ),
                  const SizedBox(height: AppDesignSystem.mdSpacing),

                  _buildDropdownOption(
                    icon: Icons.palette,
                    title: 'Theme',
                    value: theme,
                    options: const ['light', 'dark'],
                    onChanged: (value) {
                      setState(() {
                        theme = value;
                        // TODO: Update theme provider
                      });
                      // TODO: Save to API
                    },
                  ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
                    begin: -0.3,
                    end: 0,
                    curve: AppDesignSystem.smoothCurve,
                  ),
                  const SizedBox(height: AppDesignSystem.xlSpacing),

                  // Save Button
                  PremiumButton(
                    text: 'Save Settings',
                    onPressed: () {
                      // TODO: Save to API
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Settings saved successfully')),
                      );
                    },
                    isGold: true,
                  ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: AppDesignSystem.sectionTitle,
    );
  }

  Widget _buildSwitchOption({
    required IconData icon,
    required String title,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      decoration: AppDesignSystem.glassCardDecoration,
      child: ListTile(
        leading: Icon(icon, color: AppDesignSystem.gold),
        title: Text(
          title,
          style: AppDesignSystem.readableBody,
        ),
        trailing: Switch(
          value: value,
          onChanged: onChanged,
          activeColor: AppDesignSystem.gold,
        ),
      ),
    );
  }

  Widget _buildDropdownOption({
    required IconData icon,
    required String title,
    required String value,
    required List<String> options,
    required ValueChanged<String> onChanged,
  }) {
    return Container(
      decoration: AppDesignSystem.glassCardDecoration,
      child: ListTile(
        leading: Icon(icon, color: AppDesignSystem.gold),
        title: Text(
          title,
          style: AppDesignSystem.readableBody,
        ),
        trailing: DropdownButton<String>(
          value: value,
          dropdownColor: AppDesignSystem.cardBackground,
          style: const TextStyle(color: Colors.white),
          items: options.map((String option) {
            return DropdownMenuItem<String>(
              value: option,
              child: Text(option.toUpperCase()),
            );
          }).toList(),
          onChanged: (String? newValue) {
            if (newValue != null) {
              onChanged(newValue);
            }
          },
        ),
      ),
    );
  }
}
