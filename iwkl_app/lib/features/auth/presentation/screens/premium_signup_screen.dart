import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../../core/theme/theme_provider.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';

class PremiumSignupScreen extends StatefulWidget {
  const PremiumSignupScreen({super.key});

  @override
  State<PremiumSignupScreen> createState() => _PremiumSignupScreenState();
}

class _PremiumSignupScreenState extends State<PremiumSignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  int _currentStep = 0;

  final int _totalSteps = 3;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < _totalSteps - 1) {
      setState(() => _currentStep++);
    } else {
      _register();
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    }
  }

  void _register() {
    if (_formKey.currentState!.validate()) {
      context.read<AuthBloc>().add(
        RegisterEvent(
          _emailController.text.trim(),
          _passwordController.text,
          _nameController.text.trim(),
          _phoneController.text.trim(),
        ),
      );
    }
  }

  Widget _buildStepIndicator() {
    return Row(
      children: List.generate(_totalSteps, (index) {
        final isCompleted = index < _currentStep;
        final isCurrent = index == _currentStep;
        return Expanded(
          child: Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: isCompleted || isCurrent
                      ? AppDesignSystem.primaryGradient
                      : null,
                  color: isCompleted || isCurrent ? null : AppDesignSystem.cardBackground,
                  border: Border.all(
                    color: isCompleted || isCurrent
                        ? AppDesignSystem.primaryPurple
                        : AppDesignSystem.mutedText,
                    width: 2,
                  ),
                ),
                child: Center(
                  child: isCompleted
                      ? const Icon(Icons.check, size: 18, color: Colors.white)
                      : Text(
                          '${index + 1}',
                          style: TextStyle(
                            color: isCurrent ? Colors.white : AppDesignSystem.mutedText,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                ),
              ),
              if (index < _totalSteps - 1)
                Expanded(
                  child: Container(
                    height: 2,
                    margin: const EdgeInsets.symmetric(horizontal: 8),
                    color: isCompleted
                        ? AppDesignSystem.primaryPurple
                        : AppDesignSystem.mutedText.withOpacity(0.3),
                  ),
                ),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildStepContent() {
    switch (_currentStep) {
      case 0:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Personal Information',
              style: AppDesignSystem.mediumSectionTitle,
            ),
            const SizedBox(height: AppDesignSystem.mdSpacing),
            PremiumTextField(
              label: 'Full Name',
              hintText: 'Enter your full name',
              controller: _nameController,
              prefixIcon: Icons.person,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Name is required';
                }
                if (value.length < 2) {
                  return 'Name must be at least 2 characters';
                }
                return null;
              },
            ),
            const SizedBox(height: AppDesignSystem.mdSpacing),
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
                if (value.length < 10) {
                  return 'Please enter a valid phone number';
                }
                return null;
              },
            ),
          ],
        );
      case 1:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Account Details',
              style: AppDesignSystem.mediumSectionTitle,
            ),
            const SizedBox(height: AppDesignSystem.mdSpacing),
            PremiumTextField(
              label: 'Email Address',
              hintText: 'Enter your email',
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              prefixIcon: Icons.email,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Email is required';
                }
                if (!value.contains('@')) {
                  return 'Please enter a valid email';
                }
                return null;
              },
            ),
            const SizedBox(height: AppDesignSystem.mdSpacing),
            PremiumTextField(
              label: 'Password',
              hintText: 'Create a password',
              controller: _passwordController,
              isPassword: true,
              prefixIcon: Icons.lock,
              suffixIcon: _obscurePassword ? Icons.visibility : Icons.visibility_off,
              onSuffixIconPressed: () => setState(() => _obscurePassword = !_obscurePassword),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Password is required';
                }
                if (value.length < 6) {
                  return 'Password must be at least 6 characters';
                }
                return null;
              },
            ),
          ],
        );
      case 2:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Confirm Password',
              style: AppDesignSystem.mediumSectionTitle,
            ),
            const SizedBox(height: AppDesignSystem.mdSpacing),
            PremiumTextField(
              label: 'Confirm Password',
              hintText: 'Re-enter your password',
              controller: _confirmPasswordController,
              isPassword: true,
              prefixIcon: Icons.lock,
              suffixIcon: _obscureConfirmPassword ? Icons.visibility : Icons.visibility_off,
              onSuffixIconPressed: () => setState(() => _obscureConfirmPassword = !_obscureConfirmPassword),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please confirm your password';
                }
                if (value != _passwordController.text) {
                  return 'Passwords do not match';
                }
                return null;
              },
            ),
            const SizedBox(height: AppDesignSystem.lgSpacing),
            GlassCard(
              padding: const EdgeInsets.all(AppDesignSystem.mdSpacing),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.info_outline, color: AppDesignSystem.gold, size: 20),
                      const SizedBox(width: AppDesignSystem.smSpacing),
                      const Text(
                        'Password Requirements',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppDesignSystem.smSpacing),
                  const Text(
                    '• At least 6 characters\n• Should contain letters and numbers\n• Use special characters for better security',
                    style: AppDesignSystem.softGreyCaption,
                  ),
                ],
              ),
            ),
          ],
        );
      default:
        return const SizedBox();
    }
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
            height: MediaQuery.of(context).size.height - MediaQuery.of(context).padding.top,
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
                  children: [
                    const SizedBox(height: AppDesignSystem.lgSpacing),
                    
                    // Logo
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
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
                            size: 40,
                            color: AppDesignSystem.gold,
                          );
                        },
                      ),
                    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                    const SizedBox(height: AppDesignSystem.mdSpacing),
                    
                    const Text(
                      'Create Account',
                      style: AppDesignSystem.largeBoldTitle,
                    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                    const SizedBox(height: AppDesignSystem.smSpacing),
                    
                    Text(
                      'Step ${_currentStep + 1} of $_totalSteps',
                      style: AppDesignSystem.elegantSubtitle,
                    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                    const SizedBox(height: AppDesignSystem.xlSpacing),

                    // Step Indicator
                    _buildStepIndicator().animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                    const SizedBox(height: AppDesignSystem.xlSpacing),

                    // Step Content
                    Expanded(
                      child: SingleChildScrollView(
                        child: _buildStepContent().animate().fadeIn(
                          duration: AppDesignSystem.normalAnimation,
                        ).slideX(
                          begin: 0.3,
                          end: 0,
                          curve: AppDesignSystem.smoothCurve,
                        ),
                      ),
                    ),

                    // Navigation Buttons
                    Row(
                      children: [
                        if (_currentStep > 0)
                          Expanded(
                            child: PremiumButton(
                              text: 'Back',
                              onPressed: _previousStep,
                              isSecondary: true,
                              isFullWidth: true,
                            ),
                          ),
                        if (_currentStep > 0) const SizedBox(width: AppDesignSystem.mdSpacing),
                        Expanded(
                          child: PremiumButton(
                            text: _currentStep == _totalSteps - 1 ? 'Create Account' : 'Next',
                            onPressed: _nextStep,
                            isGold: true,
                            isFullWidth: true,
                            icon: _currentStep == _totalSteps - 1 ? Icons.check : Icons.arrow_forward,
                          ),
                        ),
                      ],
                    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                    const SizedBox(height: AppDesignSystem.lgSpacing),

                    // Sign In Link
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Already have an account? ',
                          style: AppDesignSystem.readableBody,
                        ),
                        TextButton(
                          onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                          child: const Text(
                            'Sign In',
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
