import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../../core/theme/theme_provider.dart';

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
      // TODO: Implement signin with phone + password
      print('Sign in with phone: ${_phoneController.text}');
    }
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
                child: Column(
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
                      text: 'Sign In',
                      onPressed: _signin,
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
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
