import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../data/models/admin_user_model.dart';

class AdminUsersScreen extends StatefulWidget {
  const AdminUsersScreen({super.key});

  @override
  State<AdminUsersScreen> createState() => _AdminUsersScreenState();
}

class _AdminUsersScreenState extends State<AdminUsersScreen> {
  final List<AdminUserModel> _users = [];
  final TextEditingController _searchController = TextEditingController();
  String _selectedStatus = 'all';

  @override
  void initState() {
    super.initState();
    _loadUsers();
  }

  void _loadUsers() {
    setState(() {
      _users.addAll([
        AdminUserModel(
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+91-9876543210',
          profileImage: '',
          role: 'user',
          permissions: ['read'],
          status: 'active',
          lastLoginAt: DateTime.now(),
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      ]);
    });
  }

  List<AdminUserModel> get _filteredUsers {
    var users = _users;
    if (_searchController.text.isNotEmpty) {
      users = users.where((u) => u.name.toLowerCase().contains(_searchController.text.toLowerCase())).toList();
    }
    if (_selectedStatus != 'all') {
      users = users.where((u) => u.status == _selectedStatus).toList();
    }
    return users;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(backgroundColor: const Color(0xFF13051E), elevation: 0, title: const Text('Users Management', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => Navigator.pop(context))),
      body: Column(
        children: [
          Padding(padding: const EdgeInsets.all(16), child: Container(decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: TextField(controller: _searchController, style: const TextStyle(color: Colors.white), decoration: const InputDecoration(hintText: 'Search users...', hintStyle: TextStyle(color: Colors.white54), prefixIcon: Icon(Icons.search, color: Color(0xFF9333EA)), border: InputBorder.none, contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12)), onChanged: (v) => setState(() {})))),
          Expanded(child: ListView.builder(padding: const EdgeInsets.symmetric(horizontal: 16), itemCount: _filteredUsers.length, itemBuilder: (context, index) {
            final user = _filteredUsers[index];
            return Container(margin: const EdgeInsets.only(bottom: 12), padding: const EdgeInsets.all(16), decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: Row(children: [
              Container(width: 50, height: 50, decoration: BoxDecoration(shape: BoxShape.circle, color: const Color(0xFF4C085D).withOpacity(0.5)), child: const Icon(Icons.person, size: 25, color: Colors.white)),
              const SizedBox(width: 16),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(user.name, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(user.email, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
                const SizedBox(height: 4),
                Row(children: [Icon(Icons.shield, size: 12, color: Colors.white54), const SizedBox(width: 4), Text(user.role.toUpperCase(), style: TextStyle(color: Colors.white54, fontSize: 11)), const SizedBox(width: 16), Icon(Icons.check_circle, size: 12, color: user.status == 'active' ? Colors.green : Colors.red), const SizedBox(width: 4), Text(user.status.toUpperCase(), style: TextStyle(color: user.status == 'active' ? Colors.green : Colors.red, fontSize: 11))]),
              ])),
              IconButton(icon: const Icon(Icons.more_vert, color: Colors.white70), onPressed: () => _showUserMenu(user)),
            ]));
          })),
        ],
      ),
    );
  }

  void _showUserMenu(AdminUserModel user) {
    showModalBottomSheet(context: context, backgroundColor: const Color(0xFF1E1E2E), shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))), builder: (context) => Container(padding: const EdgeInsets.all(20), child: Column(mainAxisSize: MainAxisSize.min, children: [
      ListTile(leading: const Icon(Icons.edit, color: Color(0xFF9333EA)), title: const Text('Edit User', style: TextStyle(color: Colors.white)), onTap: () => Navigator.pop(context)),
      ListTile(leading: const Icon(Icons.lock_reset, color: Color(0xFF9333EA)), title: const Text('Reset Password', style: TextStyle(color: Colors.white)), onTap: () => Navigator.pop(context)),
      ListTile(
        leading: Icon(user.status == 'active' ? Icons.block : Icons.check_circle, color: user.status == 'active' ? Colors.red : Colors.green),
        title: Text(user.status == 'active' ? 'Deactivate' : 'Activate', style: const TextStyle(color: Colors.white)),
        onTap: () {
          Navigator.pop(context);
          setState(() {
            final i = _users.indexWhere((u) => u.id == user.id);
            if (i != -1) _users[i] = user.copyWith(status: user.status == 'active' ? 'inactive' : 'active', updatedAt: DateTime.now());
          });
        },
      ),
    ])));
  }
}
