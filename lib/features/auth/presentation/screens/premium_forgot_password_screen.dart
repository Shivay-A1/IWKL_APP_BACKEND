import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../../core/theme/theme_provider.dart';
import 'package:iwkl_app/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:iwkl_app/features/auth/presentation/bloc/auth_event.dart';
import 'package:iwkl_app/features/auth/presentation/bloc/auth_state.dart';

class PremiumForgotPasswordScreen extends StatefulWidget {
  const PremiumForgotPasswordScreen({super.key});

  @override
  State<PremiumForgotPasswordScreen> createState() => _PremiumForgotPasswordScreenState();
}

class _PremiumForgotPasswordScreenState extends State<PremiumForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  final _newPasswordController = TextEditingController();
  bool _otpSent = false;
  bool _otpVerified = false;
  bool _obscurePassword = true;

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    _newPasswordController.dispose();
    super.dispose();
  }

  void _sendOTP() {
    if (_phoneController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter phone number')),
      );
      return;
    }
    if (_phoneController.text.length != 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter valid 10-digit phone number')),
      );
      return;
    }
    context.read<AuthBloc>().add(ForgotPasswordEvent(_phoneController.text));
  }

  void _verifyOTP() {
    if (_otpController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter OTP')),
      );
      return;
    }
    if (_otpController.text.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter valid 6-digit OTP')),
      );
      return;
    }
    context.read<AuthBloc>().add(VerifyOtpEvent(_phoneController.text, _otpController.text));
  }

  void _resetPassword() {
    if (_newPasswordController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter new password')),
      );
      return;
    }
    if (_newPasswordController.text.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Password must be at least 6 characters')),
      );
      return;
    }
    if (!_otpVerified) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please verify OTP first')),
      );
      return;
    }
    context.read<AuthBloc>().add(ResetPasswordEvent(
      _phoneController.text,
      _newPasswordController.text,
      _otpController.text,
    ));
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
                      } else if (state.message.contains('reset')) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(state.message)),
                        );
                        Navigator.pop(context);
                      }
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
                            child: const Icon(
                              Icons.lock_reset,
                              size: 50,
                              color: AppDesignSystem.gold,
                            ),
                          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                          const SizedBox(height: AppDesignSystem.lgSpacing),

                          // Title
                          const Text(
                            'Forgot Password',
                            style: AppDesignSystem.largeBoldTitle,
                          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                          const SizedBox(height: AppDesignSystem.smSpacing),

                          Text(
                            'Enter your phone number to reset password',
                            style: AppDesignSystem.readableBody,
                            textAlign: TextAlign.center,
                          ).animate().fadeIn(duration: AppDesignSystem.normalAnimation),
                          const SizedBox(height: AppDesignSystem.xlSpacing),

                          // Phone Field with OTP
                          Row(
                            children: [
                              Expanded(
                                child: PremiumTextField(
                                  label: 'Phone Number',
                                  hintText: 'Enter 10-digit phone number',
                                  controller: _phoneController,
                                  keyboardType: TextInputType.phone,
                                  prefixIcon: Icons.phone,
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Phone number is required';
                                    }
                                    if (value.length != 10) {
                                      return 'Please enter 10-digit phone number';
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
                              hintText: 'Enter 6-digit OTP sent to your phone',
                              controller: _otpController,
                              keyboardType: TextInputType.number,
                              prefixIcon: Icons.security,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'OTP is required';
                                }
                                if (value.length != 6) {
                                  return 'Please enter 6-digit OTP';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: AppDesignSystem.mdSpacing),

                            // Verify OTP Button
                            SizedBox(
                              width: double.infinity,
                              child: PremiumButton(
                                text: 'Verify OTP',
                                onPressed: _otpVerified || state is AuthLoading ? () {} : _verifyOTP,
                                isGold: false,
                              ),
                            ),
                            const SizedBox(height: AppDesignSystem.mdSpacing),
                          ],

                          // New Password Field (show after OTP verified)
                          if (_otpVerified) ...[
                            PremiumTextField(
                              label: 'New Password',
                              hintText: 'Enter new password (min 6 characters)',
                              controller: _newPasswordController,
                              isPassword: true,
                              prefixIcon: Icons.lock,
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
                            ),
                            const SizedBox(height: AppDesignSystem.xlSpacing),

                            // Reset Password Button
                            SizedBox(
                              width: double.infinity,
                              child: PremiumButton(
                                text: 'Reset Password',
                                onPressed: state is AuthLoading ? () {} : _resetPassword,
                                isGold: true,
                              ),
                            ),
                          ],
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
