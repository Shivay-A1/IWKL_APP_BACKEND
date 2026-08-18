import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../../core/theme/theme_provider.dart';

class PremiumNotificationsScreen extends StatefulWidget {
  const PremiumNotificationsScreen({super.key});

  @override
  State<PremiumNotificationsScreen> createState() => _PremiumNotificationsScreenState();
}

class _PremiumNotificationsScreenState extends State<PremiumNotificationsScreen> {
  final List<Map<String, dynamic>> _notifications = [
    {
      'type': 'Registration Updates',
      'title': 'Registration Approved',
      'message': 'Your player registration has been approved',
      'time': '2 hours ago',
      'icon': Icons.verified,
      'color': AppDesignSystem.primaryPurple,
      'isRead': false,
    },
    {
      'type': 'Admin Messages',
      'title': 'Welcome to IWKL Season 2026',
      'message': 'Get ready for an exciting season ahead',
      'time': '1 day ago',
      'icon': Icons.admin_panel_settings,
      'color': AppDesignSystem.gradientPurple,
      'isRead': false,
    },
    {
      'type': 'Match Alerts',
      'title': 'Match Reminder',
      'message': 'Gujarat Gems vs Delhi Warriors starts in 1 hour',
      'time': '3 hours ago',
      'icon': Icons.sports_kabaddi,
      'color': AppDesignSystem.darkPurple,
      'isRead': true,
    },
    {
      'type': 'Certificates',
      'title': 'New Certificate Available',
      'message': 'You have earned a new fan certificate',
      'time': '2 days ago',
      'icon': Icons.card_membership,
      'color': AppDesignSystem.gold,
      'isRead': true,
    },
    {
      'type': 'Promotions',
      'title': 'Special Offer',
      'message': 'Get 20% off on fan club membership',
      'time': '3 days ago',
      'icon': Icons.local_offer,
      'color': Colors.orange,
      'isRead': true,
    },
  ];

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
          icon: Icon(Icons.arrow_back, color: isDarkMode ? Colors.white : Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Notifications',
          style: TextStyle(
            color: isDarkMode ? Colors.white : Colors.black,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          TextButton.icon(
            onPressed: () {
              setState(() {
                for (var notification in _notifications) {
                  notification['isRead'] = true;
                }
              });
            },
            icon: const Icon(Icons.done_all, color: AppDesignSystem.gold, size: 18),
            label: const Text(
              'Mark all read',
              style: TextStyle(
                color: AppDesignSystem.gold,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
        itemCount: _notifications.length,
        itemBuilder: (context, index) {
          final notification = _notifications[index];
          return _buildNotificationCard(notification, index);
        },
      ),
    );
  }

  Widget _buildNotificationCard(Map<String, dynamic> notification, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppDesignSystem.mdSpacing),
      decoration: BoxDecoration(
        gradient: notification['isRead']
            ? AppDesignSystem.glassGradient
            : AppDesignSystem.cardGradient,
        borderRadius: BorderRadius.circular(AppDesignSystem.xlRadius),
        border: Border.all(
          color: notification['isRead']
              ? AppDesignSystem.divider
              : AppDesignSystem.primaryPurple.withOpacity(0.5),
          width: notification['isRead'] ? 1 : 2,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppDesignSystem.mdSpacing),
        child: Row(
          children: [
            // Icon
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    notification['color'],
                    notification['color'].withOpacity(0.7),
                  ],
                ),
                borderRadius: BorderRadius.circular(AppDesignSystem.mdRadius),
              ),
              child: Icon(
                notification['icon'],
                color: Colors.white,
                size: 24,
              ),
            ),
            const SizedBox(width: AppDesignSystem.mdSpacing),
            // Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        notification['type'],
                        style: AppDesignSystem.softGreyCaption,
                      ),
                      const SizedBox(width: AppDesignSystem.smSpacing),
                      if (!notification['isRead'])
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: AppDesignSystem.gold,
                            shape: BoxShape.circle,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    notification['title'],
                    style: AppDesignSystem.readableBody,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    notification['message'],
                    style: AppDesignSystem.softGreyCaption,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    notification['time'],
                    style: AppDesignSystem.softGreyCaption.copyWith(
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
            // Arrow
            Icon(
              Icons.arrow_forward_ios,
              color: AppDesignSystem.mutedText,
              size: 16,
            ),
          ],
        ),
      ),
    ).animate().fadeIn(duration: AppDesignSystem.fastAnimation).slideX(
      begin: 0.2,
      end: 0,
      curve: AppDesignSystem.smoothCurve,
      delay: Duration(milliseconds: index * 50),
    );
  }
}
