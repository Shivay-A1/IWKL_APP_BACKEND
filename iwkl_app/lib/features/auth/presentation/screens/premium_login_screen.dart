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

class PremiumLoginScreen extends StatefulWidget {
  const PremiumLoginScreen({super.key});

  @override
  State<PremiumLoginScreen> createState() => _PremiumLoginScreenState();
}

class _PremiumLoginScreenState extends State<PremiumLoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isEmailLogin = true;
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login() {
    if (_formKey.currentState!.validate()) {
      if (_isEmailLogin) {
        context.read<AuthBloc>().add(LoginEvent(
          _emailController.text,
          _passwordController.text,
        ));
      } else {
        context.read<AuthBloc>().add(PhoneLoginEvent(
          _phoneController.text,
          _passwordController.text,
        ));
      }
    }
  }

  void _googleLogin() {
    context.read<AuthBloc>().add(GoogleLoginEvent());
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDarkMode = themeProvider.isDarkMode;
    
    return Scaffold(
      backgroundColor: isDarkMode ? AppDesignSystem.primaryBackground : Colors.grey[100],
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
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Logo with Glow
                    Container(
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
                          color: AppDesignSystem.gold.withOpacity(0.5),
                          width: 2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppDesignSystem.gold.withOpacity(0.3),
                            blurRadius: 30,
                            spreadRadius:10,
                          ),
                        ],
                      ),
                      child: Image.asset(
                        'assets/IWKL-FINAL-LOGO_2.png',
                        errorBuilder: (context, error, stackTrace) {
                          return const Icon(
                            Icons.sports_kabaddi,
                            size: 60,
                            color: AppDesignSystem.gold,
                          );
                        },
                      ),
                    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).scale(
                      begin: const Offset(0.8, 0.8),
                      end: const Offset(1, 1),
                      curve: AppDesignSystem.elasticCurve,
                    ),
                    const SizedBox(height: AppDesignSystem.lgSpacing),
                    
                    // App Title
                    const Text(
                      'IWKL OFFICIAL APP',
                      style: AppDesignSystem.largeBoldTitle,
                      textAlign: TextAlign.center,
                    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideY(
                      begin: 0.3,
                      end: 0,
                      curve: AppDesignSystem.smoothCurve,
                    ),
                    const SizedBox(height: AppDesignSystem.smSpacing),
                    
                    Text(
                      'Official App of Indian Women\'s Kabaddi League',
                      style: AppDesignSystem.elegantSubtitle,
                      textAlign: TextAlign.center,
                    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideY(
                      begin: 0.3,
                      end: 0,
                      curve: AppDesignSystem.smoothCurve,
                    ),
                    const SizedBox(height: AppDesignSystem.xlSpacing),

                    // Login Type Toggle
                    Container(
                      decoration: AppDesignSystem.glassCardDecoration,
                      padding: const EdgeInsets.all(4),
                      child: Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () => setState(() => _isEmailLogin = true),
                              child: AnimatedContainer(
                                duration: AppDesignSystem.fastAnimation,
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                decoration: BoxDecoration(
                                  gradient: _isEmailLogin ? AppDesignSystem.primaryGradient : null,
                                  borderRadius: BorderRadius.circular(AppDesignSystem.mdRadius),
                                ),
                                child: Text(
                                  'Email',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: _isEmailLogin ? Colors.white : AppDesignSystem.mutedText,
                                    fontWeight: _isEmailLogin ? FontWeight.bold : FontWeight.w500,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Expanded(
                            child: GestureDetector(
                              onTap: () => setState(() => _isEmailLogin = false),
                              child: AnimatedContainer(
                                duration: AppDesignSystem.fastAnimation,
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                decoration: BoxDecoration(
                                  gradient: !_isEmailLogin ? AppDesignSystem.primaryGradient : null,
                                  borderRadius: BorderRadius.circular(AppDesignSystem.mdRadius),
                                ),
                                child: Text(
                                  'Phone',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: !_isEmailLogin ? Colors.white : AppDesignSystem.mutedText,
                                    fontWeight: !_isEmailLogin ? FontWeight.bold : FontWeight.w500,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                    const SizedBox(height: AppDesignSystem.lgSpacing),

                    // Email/Phone Field
                    PremiumTextField(
                      label: _isEmailLogin ? 'Email Address' : 'Phone Number',
                      hintText: _isEmailLogin ? 'Enter your email' : 'Enter your phone',
                      controller: _isEmailLogin ? _emailController : _phoneController,
                      keyboardType: _isEmailLogin ? TextInputType.emailAddress : TextInputType.phone,
                      prefixIcon: _isEmailLogin ? Icons.email_outlined : Icons.phone,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'This field is required';
                        }
                        if (_isEmailLogin && !value.contains('@')) {
                          return 'Please enter a valid email';
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

                    // Login Button
                    PremiumButton(
                      text: 'Sign In',
                      onPressed: _login,
                      isGold: true,
                    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).scale(
                      begin: const Offset(0.95, 0.95),
                      end: const Offset(1, 1),
                      curve: AppDesignSystem.elasticCurve,
                    ),
                    const SizedBox(height: AppDesignSystem.lgSpacing),

                    // Divider
                    Row(
                      children: [
                        Expanded(
                          child: Container(
                            height: 1,
                            color: AppDesignSystem.divider,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.mdSpacing),
                          child: Text(
                            'OR',
                            style: TextStyle(
                              color: AppDesignSystem.mutedText,
                              fontSize: 12,
                            ),
                          ),
                        ),
                        Expanded(
                          child: Container(
                            height: 1,
                            color: AppDesignSystem.divider,
                          ),
                        ),
                      ],
                    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                    const SizedBox(height: AppDesignSystem.lgSpacing),

                    // Social Login
                    OutlinedButton.icon(
                      onPressed: _googleLogin,
                      icon: const Icon(Icons.g_mobiledata, color: Colors.white),
                      label: const Text(
                        'Continue with Google',
                        style: TextStyle(color: Colors.white),
                      ),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppDesignSystem.secondaryText),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(AppDesignSystem.lgRadius),
                        ),
                      ),
                    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                    const SizedBox(height: AppDesignSystem.xlSpacing),

                    // Sign Up Link
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Don\'t have an account? ',
                          style: AppDesignSystem.readableBody,
                        ),
                        TextButton(
                          onPressed: () => Navigator.pushReplacementNamed(context, '/register'),
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
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
