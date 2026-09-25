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

class PremiumSignupScreen extends StatefulWidget {
  const PremiumSignupScreen({super.key});

  @override
  State<PremiumSignupScreen> createState() => _PremiumSignupScreenState();
}

class _PremiumSignupScreenState extends State<PremiumSignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _otpController = TextEditingController();
  bool _obscurePassword = true;
  bool _otpSent = false;
  bool _otpVerified = false;

  @override
  void dispose() {
    _firstNameController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _sendOTP() {
    if (_phoneController.text.isNotEmpty) {
      context.read<AuthBloc>().add(SendOTPEvent(_phoneController.text, 'phone'));
    }
  }

  void _verifyOTP() {
    if (_otpController.text.isNotEmpty) {
      context.read<AuthBloc>().add(VerifyOtpEvent(_phoneController.text, _otpController.text));
    }
  }

  void _signup() {
    if (_formKey.currentState!.validate() && _otpVerified) {
      context.read<AuthBloc>().add(RegisterEvent(
        _phoneController.text,
        _passwordController.text,
        _firstNameController.text,
        _otpController.text,
      ));
    }
  }

  VoidCallback _getSignupCallback(AuthState state) {
    if (!_otpVerified || state is AuthLoading) {
      return () {};
    }
    return _signup;
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
                    if (state is AuthSuccess) {
                      if (state.message.contains('OTP sent')) {
                        setState(() {
                          _otpSent = true;
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(state.message)),
                        );
                      } else if (state.message.contains('verified')) {
                        setState(() {
                          _otpVerified = true;
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(state.message)),
                        );
                      }
                    } else if (state is AuthAuthenticated) {
                      Navigator.pushReplacementNamed(
                        context,
                        '/welcome',
                        arguments: state.user.firstName,
                      );
                    } else if (state is AuthError) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(state.message)),
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
                            'Sign Up',
                            style: AppDesignSystem.largeBoldTitle,
                          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                          const SizedBox(height: AppDesignSystem.xlSpacing),

                          // First Name Field
                          PremiumTextField(
                            label: 'First Name',
                            hintText: 'Enter your first name',
                            controller: _firstNameController,
                            prefixIcon: Icons.person,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'First name is required';
                              }
                              return null;
                            },
                          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
                            begin: -0.3,
                            end: 0,
                            curve: AppDesignSystem.smoothCurve,
                          ),
                          const SizedBox(height: AppDesignSystem.mdSpacing),

                          // Phone Field with OTP
                          Row(
                            children: [
                              Expanded(
                                child: PremiumTextField(
                                  label: 'Phone Number',
                                  hintText: 'Enter your phone',
                                  controller: _phoneController,
                                  keyboardType: TextInputType.phone,
                                  prefixIcon: Icons.phone,
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Phone number is required';
                                    }
                                    return null;
                                  },
                                ),
                              ),
                              const SizedBox(width: AppDesignSystem.smSpacing),
                              Container(
                                height: 50,
                                decoration: BoxDecoration(
                                  gradient: AppDesignSystem.primaryGradient,
                                  borderRadius: BorderRadius.circular(AppDesignSystem.mdRadius),
                                ),
                                child: ElevatedButton(
                                  onPressed: _otpSent || state is AuthLoading ? null : _sendOTP,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.transparent,
                                    shadowColor: Colors.transparent,
                                  ),
                                  child: Text(
                                    _otpSent ? 'Sent' : 'Send OTP',
                                    style: const TextStyle(color: Colors.white),
                                  ),
                                ),
                              ),
                            ],
                          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
                            begin: -0.3,
                            end: 0,
                            curve: AppDesignSystem.smoothCurve,
                          ),
                          const SizedBox(height: AppDesignSystem.mdSpacing),

                          // OTP Field (show after OTP sent)
                          if (_otpSent) ...[
                            PremiumTextField(
                              label: 'OTP',
                              hintText: 'Enter 6-digit OTP',
                              controller: _otpController,
                              keyboardType: TextInputType.number,
                              prefixIcon: Icons.security,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'OTP is required';
                                }
                                if (value.length != 6) {
                                  return 'OTP must be 6 digits';
                                }
                                return null;
                              },
                            ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                            const SizedBox(height: AppDesignSystem.mdSpacing),
                            ElevatedButton(
                              onPressed: _otpVerified || state is AuthLoading ? null : _verifyOTP,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppDesignSystem.gold,
                                minimumSize: const Size(double.infinity, 50),
                              ),
                              child: Text(
                                _otpVerified ? 'Verified ✓' : 'Verify OTP',
                                style: const TextStyle(color: Colors.black),
                              ),
                            ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                            const SizedBox(height: AppDesignSystem.mdSpacing),
                          ],

                          // Password Field
                          PremiumTextField(
                            label: 'Password',
                            hintText: 'Create password',
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
                          const SizedBox(height: AppDesignSystem.lgSpacing),

                          // Sign Up Button
                          PremiumButton(
                            text: state is AuthLoading ? 'Signing Up...' : 'Sign Up',
                            onPressed: _getSignupCallback(state),
                            isGold: true,
                          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).scale(
                            begin: const Offset(0.95, 0.95),
                            end: const Offset(1, 1),
                            curve: AppDesignSystem.elasticCurve,
                          ),
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
                                onPressed: () => Navigator.pushReplacementNamed(context, '/signin'),
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
