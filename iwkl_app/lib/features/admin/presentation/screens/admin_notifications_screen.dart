import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../data/models/admin_notification_model.dart';

class AdminNotificationsScreen extends StatefulWidget {
  const AdminNotificationsScreen({super.key});

  @override
  State<AdminNotificationsScreen> createState() => _AdminNotificationsScreenState();
}

class _AdminNotificationsScreenState extends State<AdminNotificationsScreen> {
  final List<AdminNotificationModel> _notifications = [];
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _messageController = TextEditingController();
  String _audience = 'all';
  bool _pushNotification = true;
  DateTime? _scheduledAt;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  void _loadNotifications() {
    setState(() {
      _notifications.addAll([
        AdminNotificationModel(
          id: '1',
          title: 'Match Starting Soon',
          message: 'Gujarat Gems vs Maharashtra Mavericks starts in 30 minutes',
          audience: 'all',
          targetIds: [],
          pushNotification: true,
          scheduledAt: DateTime.now(),
          sent: true,
          sentAt: DateTime.now(),
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      ]);
    });
  }

  void _sendNotification() {
    if (_formKey.currentState!.validate()) {
      final notification = AdminNotificationModel(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: _titleController.text,
        message: _messageController.text,
        audience: _audience,
        targetIds: [],
        pushNotification: _pushNotification,
        scheduledAt: _scheduledAt ?? DateTime.now(),
        sent: false,
        sentAt: DateTime.now(),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      setState(() => _notifications.add(notification));
      _titleController.clear();
      _messageController.clear();
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Notification sent successfully'), backgroundColor: Color(0xFF4CAF50)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(backgroundColor: const Color(0xFF13051E), elevation: 0, title: const Text('Notifications', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => Navigator.pop(context))),
      body: Column(
        children: [
          // Send Notification Form
          Container(margin: const EdgeInsets.all(16), padding: const EdgeInsets.all(16), decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: Form(key: _formKey, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Send Notification', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildField(_titleController, 'Title *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 12),
            _buildField(_messageController, 'Message *', maxLines: 3, validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 12),
            Container(padding: const EdgeInsets.symmetric(horizontal: 16), decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: DropdownButtonHideUnderline(child: DropdownButton<String>(value: _audience, dropdownColor: const Color(0xFF1E1E2E), style: const TextStyle(color: Colors.white), isExpanded: true, items: const [DropdownMenuItem(value: 'all', child: Text('All Users')), DropdownMenuItem(value: 'users', child: Text('Registered Users')), DropdownMenuItem(value: 'players', child: Text('Players'))], onChanged: (v) => setState(() => _audience = v ?? 'all')))),
            const SizedBox(height: 12),
            SwitchListTile(title: const Text('Push Notification', style: TextStyle(color: Colors.white)), value: _pushNotification, onChanged: (v) => setState(() => _pushNotification = v)),
            const SizedBox(height: 12),
            InkWell(onTap: () async {final picked = await showDatePicker(context: context, initialDate: _scheduledAt ?? DateTime.now(), firstDate: DateTime.now(), lastDate: DateTime(2025)); if (picked != null) setState(() => _scheduledAt = picked);}, child: Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: Row(children: [const Icon(Icons.schedule, color: Color(0xFF9333EA)), const SizedBox(width: 12), Text(_scheduledAt != null ? _scheduledAt.toString().split(' ')[0] : 'Schedule (Optional)', style: TextStyle(color: _scheduledAt != null ? Colors.white : Colors.white54))]))),
            const SizedBox(height: 16),
            SizedBox(width: double.infinity, height: 45, child: ElevatedButton(onPressed: _sendNotification, style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF9333EA), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))), child: const Text('Send Now', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)))),
          ]))),
          const Divider(color: Colors.white10),
          // Notification History
          Expanded(child: ListView.builder(padding: const EdgeInsets.all(16), itemCount: _notifications.length, itemBuilder: (context, index) {
            final notif = _notifications[index];
            return Container(margin: const EdgeInsets.only(bottom: 12), padding: const EdgeInsets.all(16), decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [Expanded(child: Text(notif.title, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold))), Icon(notif.sent ? Icons.check_circle : Icons.schedule, color: notif.sent ? Colors.green : Colors.orange, size: 20)]),
              const SizedBox(height: 8),
              Text(notif.message, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12), maxLines: 2, overflow: TextOverflow.ellipsis),
              const SizedBox(height: 8),
              Row(children: [Icon(Icons.people, size: 14, color: Colors.white54), const SizedBox(width: 4), Text(notif.audience, style: TextStyle(color: Colors.white54, fontSize: 11)), const SizedBox(width: 16), Icon(Icons.access_time, size: 14, color: Colors.white54), const SizedBox(width: 4), Text(notif.sentAt.toString().split('.')[0], style: TextStyle(color: Colors.white54, fontSize: 11))]),
            ]));
          })),
        ],
      ),
    );
  }

  Widget _buildField(TextEditingController controller, String label, {int maxLines = 1, String? Function(String?)? validator}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w500)),
      const SizedBox(height: 6),
      TextFormField(controller: controller, style: const TextStyle(color: Colors.white), maxLines: maxLines, validator: validator, decoration: InputDecoration(filled: true, fillColor: Colors.white.withOpacity(0.05), border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: const Color(0xFF9333EA).withOpacity(0.3))), contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10))),
    ]);
  }
}
