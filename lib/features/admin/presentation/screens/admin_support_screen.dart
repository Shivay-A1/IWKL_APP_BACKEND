import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../data/models/admin_support_model.dart';

class AdminSupportScreen extends StatefulWidget {
  const AdminSupportScreen({super.key});

  @override
  State<AdminSupportScreen> createState() => _AdminSupportScreenState();
}

class _AdminSupportScreenState extends State<AdminSupportScreen> {
  final List<AdminSupportModel> _tickets = [];
  final TextEditingController _searchController = TextEditingController();
  String _selectedStatus = 'all';

  @override
  void initState() {
    super.initState();
    _loadTickets();
  }

  void _loadTickets() {
    setState(() {
      _tickets.addAll([
        AdminSupportModel(
          id: '1',
          userId: '1',
          userName: 'John Doe',
          subject: 'Login Issue',
          message: 'Unable to login to my account',
          category: 'technical',
          status: 'open',
          priority: 'high',
          assignedTo: '',
          resolvedAt: DateTime.now(),
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      ]);
    });
  }

  List<AdminSupportModel> get _filteredTickets {
    var tickets = _tickets;
    if (_searchController.text.isNotEmpty) {
      tickets = tickets.where((t) => t.subject.toLowerCase().contains(_searchController.text.toLowerCase())).toList();
    }
    if (_selectedStatus != 'all') {
      tickets = tickets.where((t) => t.status == _selectedStatus).toList();
    }
    return tickets;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(backgroundColor: const Color(0xFF13051E), elevation: 0, title: const Text('Support Tickets', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => Navigator.pop(context))),
      body: Column(
        children: [
          Padding(padding: const EdgeInsets.all(16), child: Row(children: [
            Expanded(child: Container(decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: TextField(controller: _searchController, style: const TextStyle(color: Colors.white), decoration: const InputDecoration(hintText: 'Search tickets...', hintStyle: TextStyle(color: Colors.white54), prefixIcon: Icon(Icons.search, color: Color(0xFF9333EA)), border: InputBorder.none, contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12)), onChanged: (v) => setState(() {})))),
            const SizedBox(width: 12),
            Container(padding: const EdgeInsets.symmetric(horizontal: 12), decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: DropdownButtonHideUnderline(child: DropdownButton<String>(value: _selectedStatus, dropdownColor: const Color(0xFF1E1E2E), style: const TextStyle(color: Colors.white), items: const [DropdownMenuItem(value: 'all', child: Text('All')), DropdownMenuItem(value: 'open', child: Text('Open')), DropdownMenuItem(value: 'in_progress', child: Text('In Progress')), DropdownMenuItem(value: 'resolved', child: Text('Resolved'))], onChanged: (v) => setState(() => _selectedStatus = v ?? 'all')))),
          ])),
          Expanded(child: ListView.builder(padding: const EdgeInsets.symmetric(horizontal: 16), itemCount: _filteredTickets.length, itemBuilder: (context, index) {
            final ticket = _filteredTickets[index];
            return Container(margin: const EdgeInsets.only(bottom: 12), padding: const EdgeInsets.all(16), decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Expanded(child: Text(ticket.subject, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold))),
                Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: ticket.priority == 'high' ? Colors.red.withOpacity(0.2) : ticket.priority == 'medium' ? Colors.orange.withOpacity(0.2) : Colors.green.withOpacity(0.2), borderRadius: BorderRadius.circular(4)), child: Text(ticket.priority.toUpperCase(), style: TextStyle(color: ticket.priority == 'high' ? Colors.red : ticket.priority == 'medium' ? Colors.orange : Colors.green, fontSize: 10, fontWeight: FontWeight.bold))),
              ]),
              const SizedBox(height: 8),
              Text(ticket.message, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12), maxLines: 2, overflow: TextOverflow.ellipsis),
              const SizedBox(height: 8),
              Row(children: [
                Icon(Icons.person, size: 12, color: Colors.white54),
                const SizedBox(width: 4),
                Text(ticket.userName, style: TextStyle(color: Colors.white54, fontSize: 11)),
                const SizedBox(width: 16),
                Icon(Icons.category, size: 12, color: Colors.white54),
                const SizedBox(width: 4),
                Text(ticket.category, style: TextStyle(color: Colors.white54, fontSize: 11)),
                const Spacer(),
                Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: ticket.status == 'open' ? Colors.blue.withOpacity(0.2) : ticket.status == 'in_progress' ? Colors.orange.withOpacity(0.2) : Colors.green.withOpacity(0.2), borderRadius: BorderRadius.circular(4)), child: Text(ticket.status.toUpperCase().replaceAll('_', ' '), style: TextStyle(color: ticket.status == 'open' ? Colors.blue : ticket.status == 'in_progress' ? Colors.orange : Colors.green, fontSize: 10, fontWeight: FontWeight.bold))),
              ]),
              const SizedBox(height: 12),
              Row(children: [
                Expanded(child: ElevatedButton(onPressed: () => _updateStatus(ticket, 'in_progress'), child: const Text('In Progress', style: TextStyle(fontSize: 12)), style: ElevatedButton.styleFrom(backgroundColor: Colors.orange, padding: const EdgeInsets.symmetric(vertical: 8)))),
                const SizedBox(width: 8),
                Expanded(child: ElevatedButton(onPressed: () => _updateStatus(ticket, 'resolved'), child: const Text('Resolve', style: TextStyle(fontSize: 12)), style: ElevatedButton.styleFrom(backgroundColor: Colors.green, padding: const EdgeInsets.symmetric(vertical: 8)))),
              ]),
            ]));
          })),
        ],
      ),
    );
  }

  void _updateStatus(AdminSupportModel ticket, String status) {
    setState(() {
      final index = _tickets.indexWhere((t) => t.id == ticket.id);
      if (index != -1) _tickets[index] = ticket.copyWith(status: status, resolvedAt: status == 'resolved' ? DateTime.now() : ticket.resolvedAt, updatedAt: DateTime.now());
    });
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Ticket ${status.replaceAll('_', ' ')}'), backgroundColor: const Color(0xFF4CAF50)));
  }
}
