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

class PremiumSigninScreen extends StatefulWidget {
  const PremiumSigninScreen({super.key});

  @override
  State<PremiumSigninScreen> createState() => _PremiumSigninScreenState();
}

class _PremiumSigninScreenState extends State<PremiumSigninScreen> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _signin() {
    if (_formKey.currentState!.validate()) {
      context.read<AuthBloc>().add(LoginEvent(
        _phoneController.text,
        _passwordController.text,
      ));
    }
  }

  VoidCallback _getSigninCallback(AuthState state) {
    if (state is AuthLoading) {
      return () {};
    }
    return _signin;
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDarkMode = themeProvider.isDarkMode;

    return Scaffold(
      backgroundColor: isDarkMode ? AppDesignSystem.primaryBackground : Colors.grey[100],
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
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
              child: Form(
                key: _formKey,
                child: BlocListener<AuthBloc, AuthState>(
                  listener: (context, state) {
                    if (state is AuthAuthenticated) {
                      Navigator.pushReplacementNamed(
                        context,
                        '/welcome',
                        arguments: state.user.firstName,
                      );
                    } else if (state is AuthError) {
                      // Show error as dialog/alert on screen
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                          backgroundColor: AppDesignSystem.cardBackground,
                          title: const Text(
                            'Error',
                            style: TextStyle(color: Colors.white),
                          ),
                          content: Text(
                            state.message,
                            style: const TextStyle(color: Colors.white70),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('OK'),
                            ),
                          ],
                        ),
                      );
                    }
                  },
                  child: BlocBuilder<AuthBloc, AuthState>(
                    builder: (context, state) {
                      return Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          // Logo
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
                            child: Image.asset(
                              'assets/IWKL-FINAL-LOGO_2.png',
                              errorBuilder: (context, error, stackTrace) {
                                return const Icon(
                                  Icons.sports_kabaddi,
                                  size: 50,
                                  color: AppDesignSystem.gold,
                                );
                              },
                            ),
                          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                          const SizedBox(height: AppDesignSystem.lgSpacing),

                          // Title
                          const Text(
                            'Sign In',
                            style: AppDesignSystem.largeBoldTitle,
                          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                          const SizedBox(height: AppDesignSystem.xlSpacing),

                          // Phone Field
                          PremiumTextField(
                            label: 'Phone Number',
                            hintText: 'Enter your phone number',
                            controller: _phoneController,
                            keyboardType: TextInputType.phone,
                            prefixIcon: Icons.phone,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Phone number is required';
                              }
                              return null;
                            },
                          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
                            begin: -0.3,
                            end: 0,
                            curve: AppDesignSystem.smoothCurve,
                          ),
                          const SizedBox(height: AppDesignSystem.mdSpacing),

                          // Password Field
                          PremiumTextField(
                            label: 'Password',
                            hintText: 'Enter your password',
                            controller: _passwordController,
                            isPassword: _obscurePassword,
                            prefixIcon: Icons.lock_outline,
                            suffixIcon: _obscurePassword ? Icons.visibility_off : Icons.visibility,
                            onSuffixIconPressed: () {
                              setState(() {
                                _obscurePassword = !_obscurePassword;
                              });
                            },
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Password is required';
                              }
                              if (value.length < 6) {
                                return 'Password must be at least 6 characters';
                              }
                              return null;
                            },
                          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
                            begin: -0.3,
                            end: 0,
                            curve: AppDesignSystem.smoothCurve,
                          ),
                          const SizedBox(height: AppDesignSystem.mdSpacing),

                          // Forgot Password
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: () => Navigator.pushNamed(context, '/forgot-password'),
                              child: const Text(
                                'Forgot Password?',
                                style: TextStyle(
                                  color: AppDesignSystem.gold,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                          ),
                          const SizedBox(height: AppDesignSystem.lgSpacing),

                          // Sign In Button
                          PremiumButton(
                            text: state is AuthLoading ? 'Signing In...' : 'Sign In',
                            onPressed: _getSigninCallback(state),
                            isGold: true,
                          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).scale(
                            begin: const Offset(0.95, 0.95),
                            end: const Offset(1, 1),
                            curve: AppDesignSystem.elasticCurve,
                          ),
                          const SizedBox(height: AppDesignSystem.lgSpacing),

                          // Sign Up Link
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                "Don't have an account? ",
                                style: AppDesignSystem.readableBody,
                              ),
                              TextButton(
                                onPressed: () => Navigator.pushReplacementNamed(context, '/signup'),
                                child: const Text(
                                  'Sign Up',
                                  style: TextStyle(
                                    color: AppDesignSystem.gold,
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                        ],
                      );
                    },
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
