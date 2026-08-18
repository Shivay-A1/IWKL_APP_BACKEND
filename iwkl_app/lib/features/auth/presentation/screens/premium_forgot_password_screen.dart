import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';

class PremiumForgotPasswordScreen extends StatefulWidget {
  const PremiumForgotPasswordScreen({super.key});

  @override
  State<PremiumForgotPasswordScreen> createState() => _PremiumForgotPasswordScreenState();
}

class _PremiumForgotPasswordScreenState extends State<PremiumForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  bool _isEmailSent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  void _sendResetLink() {
    if (_formKey.currentState!.validate()) {
      context.read<AuthBloc>().add(
        ForgotPasswordEvent(_emailController.text.trim()),
      );
      setState(() => _isEmailSent = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppDesignSystem.primaryBackground,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Container(
            height: MediaQuery.of(context).size.height - MediaQuery.of(context).padding.top,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [AppDesignSystem.primaryBackground, Color(0xFF0A0510)],
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.all(AppDesignSystem.xlSpacing),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Back Button
                    Align(
                      alignment: Alignment.topLeft,
                      child: IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: const Icon(Icons.arrow_back, color: Colors.white),
                      ),
                    ).animate().fadeIn(duration: AppDesignSystem.fastAnimation),
                    const SizedBox(height: AppDesignSystem.lgSpacing),

                    // Icon
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [
                            AppDesignSystem.primaryPurple.withOpacity(0.3),
                            AppDesignSystem.gradientPurple.withOpacity(0.1),
                            Colors.transparent,
                          ],
                        ),
                      ),
                      child: Icon(
                        _isEmailSent ? Icons.check_circle : Icons.lock_reset,
                        size: 50,
                        color: _isEmailSent ? AppDesignSystem.gold : AppDesignSystem.primaryPurple,
                      ),
                    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).scale(
                      begin: const Offset(0.8, 0.8),
                      end: const Offset(1, 1),
                      curve: AppDesignSystem.elasticCurve,
                    ),
                    const SizedBox(height: AppDesignSystem.lgSpacing),

                    // Title
                    Text(
                      _isEmailSent ? 'Email Sent!' : 'Forgot Password?',
                      style: AppDesignSystem.largeBoldTitle,
                      textAlign: TextAlign.center,
                    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                    const SizedBox(height: AppDesignSystem.smSpacing),

                    // Subtitle
                    Text(
                      _isEmailSent
                          ? 'We\'ve sent a password reset link to your email. Please check your inbox.'
                          : 'Enter your email address and we\'ll send you a link to reset your password.',
                      style: AppDesignSystem.elegantSubtitle,
                      textAlign: TextAlign.center,
                    ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                    const SizedBox(height: AppDesignSystem.xlSpacing),

                    if (!_isEmailSent) ...[
                      // Email Field
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
                      ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
                        begin: -0.3,
                        end: 0,
                        curve: AppDesignSystem.smoothCurve,
                      ),
                      const SizedBox(height: AppDesignSystem.xlSpacing),

                      // Send Link Button
                      PremiumButton(
                        text: 'Send Reset Link',
                        onPressed: _sendResetLink,
                        isGold: true,
                      ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).scale(
                        begin: const Offset(0.95, 0.95),
                        end: const Offset(1, 1),
                        curve: AppDesignSystem.elasticCurve,
                      ),
                    ] else ...[
                      // Back to Login Button
                      PremiumButton(
                        text: 'Back to Login',
                        onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                        isGold: true,
                      ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).scale(
                        begin: const Offset(0.95, 0.95),
                        end: const Offset(1, 1),
                        curve: AppDesignSystem.elasticCurve,
                      ),
                    ],
                    const SizedBox(height: AppDesignSystem.lgSpacing),

                    // Sign In Link
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Remember your password? ',
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
