import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'package:dio/dio.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../../core/theme/theme_provider.dart';
import '../../../../core/network/socket_client.dart';
import '../../data/repositories/notification_repository_impl.dart';

class PremiumNotificationsScreen extends StatefulWidget {
  const PremiumNotificationsScreen({super.key});

  @override
  State<PremiumNotificationsScreen> createState() => _PremiumNotificationsScreenState();
}

class _PremiumNotificationsScreenState extends State<PremiumNotificationsScreen> {
  final NotificationRepositoryImpl _notificationRepository = NotificationRepositoryImpl(Dio());
  final SocketClient _socketClient = SocketClient();
  List<Map<String, dynamic>> _notifications = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
    _setupSocketListeners();
    _socketClient.connect();
  }

  @override
  void dispose() {
    _socketClient.offNewNotification();
    super.dispose();
  }

  void _setupSocketListeners() {
    _socketClient.onNewNotification((data) {
      print('New notification received in screen: $data');
      _loadNotifications();
    });
  }

  Future<void> _loadNotifications() async {
    try {
      final result = await _notificationRepository.getNotifications();
      result.fold(
        (failure) {
          setState(() {
            _loading = false;
          });
        },
        (notifications) {
          setState(() {
            _notifications = notifications;
            _loading = false;
          });
        },
      );
    } catch (e) {
      setState(() {
        _loading = false;
      });
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
          if (_notifications.isNotEmpty)
            TextButton.icon(
              onPressed: () async {
                await _notificationRepository.markAllAsRead();
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
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _notifications.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.notifications_none,
                        size: 64,
                        color: isDarkMode ? Colors.grey[600] : Colors.grey[400],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'No notifications yet',
                        style: TextStyle(
                          color: isDarkMode ? Colors.grey[400] : Colors.grey[600],
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadNotifications,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
                    itemCount: _notifications.length,
                    itemBuilder: (context, index) {
                      final notification = _notifications[index];
                      return _buildNotificationCard(notification, index);
                    },
                  ),
                ),
    );
  }

  Widget _buildNotificationCard(Map<String, dynamic> notification, int index) {
    final isRead = notification['isRead'] == true;
    final title = notification['title'] as String? ?? 'Notification';
    final message = notification['message'] as String? ?? '';
    final createdAt = notification['createdAt'] as String?;
    final time = createdAt != null
        ? _formatTime(createdAt)
        : 'Just now';

    return Container(
      margin: const EdgeInsets.only(bottom: AppDesignSystem.mdSpacing),
      decoration: BoxDecoration(
        gradient: isRead
            ? AppDesignSystem.glassGradient
            : AppDesignSystem.cardGradient,
        borderRadius: BorderRadius.circular(AppDesignSystem.xlRadius),
        border: Border.all(
          color: isRead
              ? AppDesignSystem.divider
              : AppDesignSystem.primaryPurple.withOpacity(0.5),
          width: isRead ? 1 : 2,
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
                    AppDesignSystem.primaryPurple,
                    AppDesignSystem.primaryPurple.withOpacity(0.7),
                  ],
                ),
                borderRadius: BorderRadius.circular(AppDesignSystem.mdRadius),
              ),
              child: Icon(
                Icons.notifications,
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
                        'Admin Notification',
                        style: AppDesignSystem.softGreyCaption,
                      ),
                      const SizedBox(width: AppDesignSystem.smSpacing),
                      if (!isRead)
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
                    title,
                    style: AppDesignSystem.readableBody,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    message,
                    style: AppDesignSystem.softGreyCaption,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    time,
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

  String _formatTime(String createdAt) {
    try {
      final dateTime = DateTime.parse(createdAt);
      final now = DateTime.now();
      final difference = now.difference(dateTime);

      if (difference.inMinutes < 1) {
        return 'Just now';
      } else if (difference.inMinutes < 60) {
        return '${difference.inMinutes} min ago';
      } else if (difference.inHours < 24) {
        return '${difference.inHours} hours ago';
      } else {
        return '${difference.inDays} days ago';
      }
    } catch (e) {
      return 'Just now';
    }
  }
}
