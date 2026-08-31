import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:iwkl_app/core/constants/app_constants.dart';
import 'package:iwkl_app/core/widgets/glass_card.dart';
import 'package:iwkl_app/core/widgets/premium_app_bar.dart';

class MessagesScreen extends StatefulWidget {
  const MessagesScreen({super.key});

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  int _unreadCount = 0;
  List<Message> _messages = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchMessages();
  }

  Future<void> _fetchMessages() async {
    setState(() => _isLoading = true);
    try {
      // TODO: Implement API call to fetch messages
      // final response = await api.get('/messages/inbox');
      // setState(() {
      //   _messages = response.data['messages'];
      //   _unreadCount = response.data['unreadCount'];
      // });
      
      // Mock data for now
      setState(() {
        _messages = [
          Message(
            id: '1',
            subject: 'Welcome to IWKL',
            content: 'Thank you for registering with IWKL. Your registration is currently under review.',
            senderName: 'Admin',
            senderEmail: 'admin@iwkl.org',
            isRead: false,
            createdAt: DateTime.now().subtract(const Duration(hours: 2)),
          ),
          Message(
            id: '2',
            subject: 'Trial Schedule Update',
            content: 'Your trial has been scheduled for next Monday at 10 AM. Please report to the venue 30 minutes early.',
            senderName: 'Admin',
            senderEmail: 'admin@iwkl.org',
            isRead: true,
            createdAt: DateTime.now().subtract(const Duration(days: 1)),
          ),
        ];
        _unreadCount = 1;
      });
    } catch (e) {
      print('Error fetching messages: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _markAsRead(String messageId) async {
    try {
      // TODO: Implement API call to mark as read
      // await api.patch('/messages/$messageId/read');
      setState(() {
        final message = _messages.firstWhere((m) => m.id == messageId);
        message.isRead = true;
        _unreadCount--;
      });
    } catch (e) {
      print('Error marking as read: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PremiumAppBar(
        title: 'Messages',
        actions: [
          if (_unreadCount > 0)
            Container(
              margin: const EdgeInsets.only(right: 16),
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Color(AppConstants.accentColorValue),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '$_unreadCount',
                style: const TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _messages.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.mail_outline,
                        size: 64,
                        color: Colors.white.withOpacity(0.3),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'No messages yet',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.5),
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _messages.length,
                  itemBuilder: (context, index) {
                    final message = _messages[index];
                    return _buildMessageCard(message, index);
                  },
                ),
    );
  }

  Widget _buildMessageCard(Message message, int index) {
    return GlassCard(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      borderRadius: BorderRadius.circular(16),
      onTap: () => _showMessageDetail(message),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Color(AppConstants.accentColorValue),
                  Color(AppConstants.accentColorValue).withOpacity(0.7),
                ],
              ),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                message.senderName[0].toUpperCase(),
                style: const TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        message.senderName,
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: message.isRead ? FontWeight.normal : FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ),
                    Text(
                      _formatDate(message.createdAt),
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.5),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  message.subject,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.8),
                    fontWeight: message.isRead ? FontWeight.normal : FontWeight.w600,
                    fontSize: 14,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  message.content,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.5),
                    fontSize: 12,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          if (!message.isRead)
            Container(
              margin: const EdgeInsets.only(left: 8),
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: Color(AppConstants.accentColorValue),
                shape: BoxShape.circle,
              ),
            ),
        ],
      ),
    ).animate().fadeIn(delay: (index * 100).ms).slideX(begin: -0.1);
  }

  void _showMessageDetail(Message message) {
    if (!message.isRead) {
      _markAsRead(message.id);
    }
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.8,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              const Color(AppConstants.primaryColorValue),
              const Color(AppConstants.secondaryColorValue),
              const Color(AppConstants.backgroundColorValue),
            ],
          ),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const Expanded(
                    child: Text(
                      'Message',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 60,
                          height: 60,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Color(AppConstants.accentColorValue),
                                Color(AppConstants.accentColorValue).withOpacity(0.7),
                              ],
                            ),
                            shape: BoxShape.circle,
                          ),
                          child: Center(
                            child: Text(
                              message.senderName[0].toUpperCase(),
                              style: const TextStyle(
                                color: Colors.black,
                                fontWeight: FontWeight.bold,
                                fontSize: 24,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                message.senderName,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                message.senderEmail,
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.6),
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Text(
                      message.subject,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _formatDate(message.createdAt),
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.5),
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 24),
                    GlassCard(
                      padding: const EdgeInsets.all(16),
                      borderRadius: BorderRadius.circular(16),
                      child: Text(
                        message.content,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          height: 1.5,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Reply button
                    GlassCard(
                      onTap: () {
                        Navigator.pop(context);
                        _showReplyDialog(message);
                      },
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      borderRadius: BorderRadius.circular(12),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.reply, color: Colors.white),
                          SizedBox(width: 8),
                          Text(
                            'Reply',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showReplyDialog(Message message) {
    final replyController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(AppConstants.backgroundColorValue),
        title: const Text(
          'Reply',
          style: TextStyle(color: Colors.white),
        ),
        content: TextField(
          controller: replyController,
          maxLines: 5,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: 'Type your reply...',
            hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.white.withOpacity(0.3)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Color(AppConstants.accentColorValue)),
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Colors.white),
            ),
          ),
          ElevatedButton(
            onPressed: () async {
              if (replyController.text.trim().isEmpty) return;
              
              try {
                // TODO: Implement API call to send reply
                // await api.post('/messages/${message.id}/reply', {
                //   content: replyController.text.trim(),
                // });
                
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Reply sent successfully')),
                );
              } catch (e) {
                print('Error sending reply: $e');
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Failed to send reply')),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(AppConstants.accentColorValue),
            ),
            child: const Text(
              'Send',
              style: TextStyle(color: Colors.black),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);
    
    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inHours < 1) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inDays < 1) {
      return '${difference.inHours}h ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}

class Message {
  final String id;
  final String subject;
  final String content;
  final String senderName;
  final String senderEmail;
  bool isRead;
  final DateTime createdAt;

  Message({
    required this.id,
    required this.subject,
    required this.content,
    required this.senderName,
    required this.senderEmail,
    required this.isRead,
    required this.createdAt,
  });
}
