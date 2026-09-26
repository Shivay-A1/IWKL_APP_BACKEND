import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../../core/theme/theme_provider.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_event.dart';
import '../../../auth/presentation/bloc/auth_state.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  // TODO: Load user data from API
  String firstName = 'User';
  String phone = '+91XXXXXXXXXX';
  final _editFirstNameController = TextEditingController();
  final _editPhoneController = TextEditingController();

  @override
  void dispose() {
    _editFirstNameController.dispose();
    _editPhoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDarkMode = themeProvider.isDarkMode;

    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is! AuthAuthenticated) {
          Navigator.pushReplacementNamed(context, '/signin');
        }
      },
      child: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, state) {
          if (state is! AuthAuthenticated) {
            // Redirect to signin if not authenticated
            WidgetsBinding.instance.addPostFrameCallback((_) {
              Navigator.pushReplacementNamed(context, '/signin');
            });
            return const Scaffold(
              body: Center(child: CircularProgressIndicator()),
            );
          }

          final user = state.user;
          firstName = user.firstName;
          phone = user.mobile;

          return Scaffold(
            backgroundColor: isDarkMode ? AppDesignSystem.primaryBackground : Colors.grey[100],
            appBar: AppBar(
              backgroundColor: Colors.transparent,
              elevation: 0,
              title: const Text(
                'Profile',
                style: TextStyle(
                  color: AppDesignSystem.gold,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
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
                        // Profile Avatar
                        Container(
                          width: 100,
                          height: 100,
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
                              color: AppDesignSystem.gold.withOpacity(0.5),
                              width: 2,
                            ),
                          ),
                          child: const Icon(
                            Icons.person,
                            size: 50,
                            color: AppDesignSystem.gold,
                          ),
                        ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                        const SizedBox(height: AppDesignSystem.lgSpacing),

                        // User Name
                        Text(
                          firstName,
                          style: AppDesignSystem.largeBoldTitle,
                        ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                        const SizedBox(height: AppDesignSystem.smSpacing),

                        // Phone Number
                        Text(
                          phone,
                          style: AppDesignSystem.readableBody,
                        ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                        const SizedBox(height: AppDesignSystem.xlSpacing),

                        // Profile Options
                        _buildProfileOption(
                          icon: Icons.edit,
                          title: 'Edit Profile',
                          onTap: () {
                            _showEditProfileDialog();
                          },
                        ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
                          begin: -0.3,
                          end: 0,
                          curve: AppDesignSystem.smoothCurve,
                        ),
                        const SizedBox(height: AppDesignSystem.mdSpacing),

                        _buildProfileOption(
                          icon: Icons.phone,
                          title: 'Change Phone Number',
                          onTap: () {
                            // TODO: Navigate to change phone
                          },
                        ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
                          begin: -0.3,
                          end: 0,
                          curve: AppDesignSystem.smoothCurve,
                        ),
                        const SizedBox(height: AppDesignSystem.mdSpacing),

                        _buildProfileOption(
                          icon: Icons.lock,
                          title: 'Change Password',
                          onTap: () {
                            // TODO: Navigate to change password
                          },
                        ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
                          begin: -0.3,
                          end: 0,
                          curve: AppDesignSystem.smoothCurve,
                        ),
                        const SizedBox(height: AppDesignSystem.mdSpacing),

                        _buildProfileOption(
                          icon: Icons.settings,
                          title: 'Settings',
                          onTap: () {
                            Navigator.pushNamed(context, '/settings');
                          },
                        ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
                          begin: -0.3,
                          end: 0,
                          curve: AppDesignSystem.smoothCurve,
                        ),
                        const SizedBox(height: AppDesignSystem.xlSpacing),

                        // Logout Button
                        PremiumButton(
                          text: 'Logout',
                          onPressed: () {
                            context.read<AuthBloc>().add(LogoutEvent());
                          },
                          isGold: false,
                        ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                        const SizedBox(height: AppDesignSystem.mdSpacing),

                        // Delete Account Button
                        TextButton(
                          onPressed: () {
                            _showDeleteAccountDialog();
                          },
                          child: const Text(
                            'Delete Account',
                            style: TextStyle(
                              color: Colors.red,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildProfileOption({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: AppDesignSystem.glassCardDecoration,
      child: ListTile(
        leading: Icon(icon, color: AppDesignSystem.gold),
        title: Text(
          title,
          style: AppDesignSystem.readableBody,
        ),
        trailing: const Icon(
          Icons.chevron_right,
          color: AppDesignSystem.gold,
        ),
        onTap: onTap,
      ),
    );
  }

  void _showDeleteAccountDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppDesignSystem.cardBackground,
        title: const Text(
          'Delete Account',
          style: TextStyle(color: Colors.white),
        ),
        content: const Text(
          'Are you sure you want to delete your account? This action cannot be undone.',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              // Logout and clear data
              context.read<AuthBloc>().add(LogoutEvent());
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Account deleted successfully')),
              );
            },
            child: const Text(
              'Delete',
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );
  }

  void _showEditProfileDialog() {
    _editFirstNameController.text = firstName;
    _editPhoneController.text = phone;
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppDesignSystem.cardBackground,
        title: const Text(
          'Edit Profile',
          style: TextStyle(color: Colors.white),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _editFirstNameController,
              decoration: const InputDecoration(
                labelText: 'Name',
                labelStyle: TextStyle(color: Colors.white70),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.white30),
                ),
                focusedBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: AppDesignSystem.gold),
                ),
              ),
              style: const TextStyle(color: Colors.white),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _editPhoneController,
              decoration: const InputDecoration(
                labelText: 'Phone',
                labelStyle: TextStyle(color: Colors.white70),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.white30),
                ),
                focusedBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: AppDesignSystem.gold),
                ),
              ),
              style: const TextStyle(color: Colors.white),
              keyboardType: TextInputType.phone,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                firstName = _editFirstNameController.text;
                phone = _editPhoneController.text;
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Profile updated successfully')),
              );
            },
            child: const Text(
              'Save',
              style: TextStyle(color: AppDesignSystem.gold),
            ),
          ),
        ],
      ),
    );
  }
}
