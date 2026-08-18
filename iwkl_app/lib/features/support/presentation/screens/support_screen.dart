import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:url_launcher/url_launcher.dart';

class SupportScreen extends StatelessWidget {
  const SupportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: const Text(
          'Support',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Support Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF4C085D),
                  const Color(0xFF9333EA),
                  const Color(0xFFEC4899).withOpacity(0.3),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                const Icon(
                  Icons.support_agent,
                  size: 60,
                  color: Colors.white,
                ),
                const SizedBox(height: 12),
                const Text(
                  'How can we help?',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'We\'re here to assist you',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.7),
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 300.ms).scale(begin: const Offset(0.9, 0.9)),
          const SizedBox(height: 24),
          
          // Contact Options
          _buildSectionTitle('Contact Us'),
          const SizedBox(height: 12),
          
          // WhatsApp
          _buildContactCard(
            icon: Icons.message,
            title: 'WhatsApp',
            subtitle: 'Chat with us instantly',
            color: const Color(0xFF25D366),
            onTap: () async {
              final whatsappUrl = Uri.parse('https://wa.me/919876543210');
              if (await canLaunchUrl(whatsappUrl)) {
                await launchUrl(whatsappUrl);
              }
            },
          ),
          const SizedBox(height: 12),
          
          // Call
          _buildContactCard(
            icon: Icons.phone,
            title: 'Call Us',
            subtitle: '+91 98765 43210',
            color: const Color(0xFF9333EA),
            onTap: () async {
              final phoneUrl = Uri.parse('tel:+919876543210');
              if (await canLaunchUrl(phoneUrl)) {
                await launchUrl(phoneUrl);
              }
            },
          ),
          const SizedBox(height: 12),
          
          // Email
          _buildContactCard(
            icon: Icons.email,
            title: 'Email',
            subtitle: 'support@iwkl.com',
            color: const Color(0xFFEC4899),
            onTap: () async {
              final emailUrl = Uri.parse('mailto:support@iwkl.com');
              if (await canLaunchUrl(emailUrl)) {
                await launchUrl(emailUrl);
              }
            },
          ),
          const SizedBox(height: 24),
          
          // Help Resources
          _buildSectionTitle('Help Resources'),
          const SizedBox(height: 12),
          
          // FAQs
          _buildContactCard(
            icon: Icons.help_outline,
            title: 'FAQs',
            subtitle: 'Frequently asked questions',
            color: const Color(0xFF4C085D),
            onTap: () {
              _showFAQsDialog(context);
            },
          ),
          const SizedBox(height: 12),
          
          // Live Chat
          _buildContactCard(
            icon: Icons.chat,
            title: 'Live Chat',
            subtitle: 'Chat with our support team',
            color: const Color(0xFF9333EA),
            onTap: () {
              // Navigate to live chat
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4),
      child: Text(
        title,
        style: const TextStyle(
          color: Color(0xFF9333EA),
          fontSize: 16,
          fontWeight: FontWeight.bold,
          letterSpacing: 1,
        ),
      ),
    );
  }

  Widget _buildContactCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.05),
            Colors.white.withOpacity(0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withOpacity(0.3),
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          splashColor: color.withOpacity(0.2),
          highlightColor: color.withOpacity(0.1),
          child: ListTile(
            leading: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    color.withOpacity(0.2),
                    color.withOpacity(0.1),
                  ],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: color,
                size: 24,
              ),
            ),
            title: Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            subtitle: Text(
              subtitle,
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 13,
              ),
            ),
            trailing: Icon(
              Icons.chevron_right,
              color: color.withOpacity(0.5),
            ),
          ),
        ),
      ),
    ).animate().fadeIn(duration: 200.ms).slideX(begin: -0.1, end: 0);
  }

  void _showFAQsDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E1E2E),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text(
          'Frequently Asked Questions',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        content: SizedBox(
          width: double.maxFinite,
          child: ListView(
            shrinkWrap: true,
            children: [
              _buildFAQItem('How do I register?', 'You can register through our official website or contact support for assistance.'),
              _buildFAQItem('How to reset password?', 'Go to Settings > Edit Profile > Reset Password or use Forgot Password on login screen.'),
              _buildFAQItem('How to contact support?', 'You can reach us via WhatsApp, Phone, Email, or Live Chat.'),
              _buildFAQItem('Is the app free?', 'Yes, the IWKL app is completely free to download and use.'),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Close',
              style: TextStyle(color: Color(0xFF9333EA)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFAQItem(String question, String answer) {
    return ExpansionTile(
      title: Text(
        question,
        style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600),
      ),
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Text(
            answer,
            style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 13),
          ),
        ),
      ],
    );
  }
}
