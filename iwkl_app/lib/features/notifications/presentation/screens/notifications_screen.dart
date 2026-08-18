import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class NotificationsScreen extends StatefulWidget {
  final List<NotificationItem> notifications;

  const NotificationsScreen({
    super.key,
    this.notifications = const [],
  });

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final List<Map<String, dynamic>> _notifications = [
    {
      'type': 'Registration Updates',
      'title': 'Registration Approved',
      'message': 'Your player registration has been approved',
      'time': '2 hours ago',
      'icon': Icons.verified,
      'color': const Color(0xFF9333EA),
      'isRead': false,
    },
    {
      'type': 'Admin Messages',
      'title': 'Welcome to IWKL Season 2026',
      'message': 'Get ready for an exciting season ahead',
      'time': '1 day ago',
      'icon': Icons.admin_panel_settings,
      'color': const Color(0xFFEC4899),
      'isRead': false,
    },
    {
      'type': 'Match Alerts',
      'title': 'Match Reminder',
      'message': 'Gujarat Gems vs Maharashtra Mavericks starts in 1 hour',
      'time': '3 hours ago',
      'icon': Icons.sports_kabaddi,
      'color': const Color(0xFF4C085D),
      'isRead': true,
    },
    {
      'type': 'Certificates',
      'title': 'New Certificate Available',
      'message': 'You have earned a new fan certificate',
      'time': '2 days ago',
      'icon': Icons.card_membership,
      'color': const Color(0xFF9333EA),
      'isRead': true,
    },
    {
      'type': 'Promotions',
      'title': 'Special Offer',
      'message': 'Get 20% off on fan club membership',
      'time': '3 days ago',
      'icon': Icons.local_offer,
      'color': const Color(0xFFEC4899),
      'isRead': true,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Notifications',
          style: TextStyle(
            color: Colors.white,
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
            icon: const Icon(Icons.done_all, color: Color(0xFF9333EA), size: 18),
            label: const Text(
              'Mark all read',
              style: TextStyle(
                color: Color(0xFF9333EA),
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
      body: _notifications.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.notifications_none,
                    size: 64,
                    color: Colors.white.withOpacity(0.3),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No notifications yet',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.6),
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _notifications.length,
              itemBuilder: (context, index) {
                final notification = _notifications[index];
                return _buildNotificationItem(notification, index);
              },
            ),
    );
  }

  Widget _buildNotificationItem(Map<String, dynamic> notification, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.05),
            Colors.white.withOpacity(0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: notification['isRead'] 
              ? Colors.transparent 
              : (notification['color'] as Color).withOpacity(0.5),
          width: notification['isRead'] ? 1 : 2,
        ),
      ),
      child: Row(
        children: [
          // Icon
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  (notification['color'] as Color).withOpacity(0.3),
                  (notification['color'] as Color).withOpacity(0.1),
                ],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              notification['icon'],
              color: notification['color'],
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          // Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  notification['title'],
                  style: TextStyle(
                    color: notification['isRead'] 
                        ? Colors.white.withOpacity(0.7) 
                        : Colors.white,
                    fontSize: 14,
                    fontWeight: notification['isRead'] 
                        ? FontWeight.normal 
                        : FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  notification['message'],
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.6),
                    fontSize: 12,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  notification['time'],
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.4),
                    fontSize: 10,
                  ),
                ),
              ],
            ),
          ),
          // Unread Indicator
          if (!notification['isRead'])
            Container(
              width: 8,
              height: 8,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Color(0xFF9333EA),
                    Color(0xFFEC4899),
                  ],
                ),
                shape: BoxShape.circle,
              ),
            ),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms, delay: (index * 100).ms).slideX(begin: -0.1, end: 0);
  }
}

class NotificationItem {
  final String title;
  final String body;
  final String type;
  final DateTime createdAt;
  final String? deepLink;
  bool isRead;

  NotificationItem({
    required this.title,
    required this.body,
    required this.type,
    required this.createdAt,
    this.deepLink,
    this.isRead = false,
  });

  void markAsRead() {
    isRead = true;
  }
}
