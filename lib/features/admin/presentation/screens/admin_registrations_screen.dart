import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../data/models/admin_registration_model.dart';

class AdminRegistrationsScreen extends StatefulWidget {
  const AdminRegistrationsScreen({super.key});

  @override
  State<AdminRegistrationsScreen> createState() => _AdminRegistrationsScreenState();
}

class _AdminRegistrationsScreenState extends State<AdminRegistrationsScreen> {
  final List<AdminRegistrationModel> _registrations = [];
  final TextEditingController _searchController = TextEditingController();
  String _selectedStatus = 'all';

  @override
  void initState() {
    super.initState();
    _loadRegistrations();
  }

  void _loadRegistrations() {
    setState(() {
      _registrations.addAll([
        AdminRegistrationModel(
          id: '1',
          playerId: '1',
          playerName: 'Rahul Kumar',
          photo: '',
          phone: '+91-9876543210',
          email: 'rahul@example.com',
          address: 'Gujarat, India',
          documents: '[]',
          remarks: '',
          status: 'pending',
          approvedAt: DateTime.now(),
          rejectedAt: DateTime.now(),
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      ]);
    });
  }

  List<AdminRegistrationModel> get _filteredRegistrations {
    var regs = _registrations;
    if (_searchController.text.isNotEmpty) {
      regs = regs.where((r) => r.playerName.toLowerCase().contains(_searchController.text.toLowerCase())).toList();
    }
    if (_selectedStatus != 'all') {
      regs = regs.where((r) => r.status == _selectedStatus).toList();
    }
    return regs;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(backgroundColor: const Color(0xFF13051E), elevation: 0, title: const Text('Registrations', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => Navigator.pop(context))),
      body: Column(
        children: [
          Padding(padding: const EdgeInsets.all(16), child: Row(children: [
            Expanded(child: Container(decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: TextField(controller: _searchController, style: const TextStyle(color: Colors.white), decoration: const InputDecoration(hintText: 'Search...', hintStyle: TextStyle(color: Colors.white54), prefixIcon: Icon(Icons.search, color: Color(0xFF9333EA)), border: InputBorder.none, contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12)), onChanged: (v) => setState(() {})))),
            const SizedBox(width: 12),
            Container(padding: const EdgeInsets.symmetric(horizontal: 12), decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: DropdownButtonHideUnderline(child: DropdownButton<String>(value: _selectedStatus, dropdownColor: const Color(0xFF1E1E2E), style: const TextStyle(color: Colors.white), items: const [DropdownMenuItem(value: 'all', child: Text('All')), DropdownMenuItem(value: 'pending', child: Text('Pending')), DropdownMenuItem(value: 'approved', child: Text('Approved')), DropdownMenuItem(value: 'rejected', child: Text('Rejected'))], onChanged: (v) => setState(() => _selectedStatus = v ?? 'all')))),
          ])),
          Expanded(child: ListView.builder(padding: const EdgeInsets.symmetric(horizontal: 16), itemCount: _filteredRegistrations.length, itemBuilder: (context, index) {
            final reg = _filteredRegistrations[index];
            return Container(margin: const EdgeInsets.only(bottom: 12), padding: const EdgeInsets.all(16), decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Container(width: 50, height: 50, decoration: BoxDecoration(shape: BoxShape.circle, color: const Color(0xFF4C085D).withOpacity(0.5)), child: const Icon(Icons.person, size: 25, color: Colors.white)),
                const SizedBox(width: 16),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(reg.playerName, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(reg.email, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
                ])),
                Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: reg.status == 'approved' ? Colors.green.withOpacity(0.2) : reg.status == 'rejected' ? Colors.red.withOpacity(0.2) : Colors.orange.withOpacity(0.2), borderRadius: BorderRadius.circular(6)), child: Text(reg.status.toUpperCase(), style: TextStyle(color: reg.status == 'approved' ? Colors.green : reg.status == 'rejected' ? Colors.red : Colors.orange, fontSize: 10, fontWeight: FontWeight.bold))),
              ]),
              const SizedBox(height: 12),
              Row(children: [
                Expanded(child: ElevatedButton.icon(onPressed: () => _approveRegistration(reg), icon: const Icon(Icons.check, size: 16), label: const Text('Approve'), style: ElevatedButton.styleFrom(backgroundColor: Colors.green, padding: const EdgeInsets.symmetric(vertical: 8), textStyle: const TextStyle(fontSize: 12), foregroundColor: Colors.white))),
                const SizedBox(width: 8),
                Expanded(child: ElevatedButton.icon(onPressed: () => _rejectRegistration(reg), icon: const Icon(Icons.close, size: 16), label: const Text('Reject'), style: ElevatedButton.styleFrom(backgroundColor: Colors.red, padding: const EdgeInsets.symmetric(vertical: 8), textStyle: const TextStyle(fontSize: 12), foregroundColor: Colors.white))),
                const SizedBox(width: 8),
                Expanded(child: ElevatedButton.icon(onPressed: () => _viewDocuments(reg), icon: const Icon(Icons.description, size: 16), label: const Text('Documents'), style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF9333EA), padding: const EdgeInsets.symmetric(vertical: 8), textStyle: const TextStyle(fontSize: 12), foregroundColor: Colors.white))),
              ]),
            ]));
          })),
        ],
      ),
    );
  }

  void _approveRegistration(AdminRegistrationModel reg) {
    setState(() {
      final index = _registrations.indexWhere((r) => r.id == reg.id);
      if (index != -1) _registrations[index] = reg.copyWith(status: 'approved', approvedAt: DateTime.now(), updatedAt: DateTime.now());
    });
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Registration approved'), backgroundColor: Color(0xFF4CAF50)));
  }

  void _rejectRegistration(AdminRegistrationModel reg) {
    setState(() {
      final index = _registrations.indexWhere((r) => r.id == reg.id);
      if (index != -1) _registrations[index] = reg.copyWith(status: 'rejected', rejectedAt: DateTime.now(), updatedAt: DateTime.now());
    });
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Registration rejected'), backgroundColor: Colors.red));
  }

  void _viewDocuments(AdminRegistrationModel reg) {
    showDialog(context: context, builder: (context) => AlertDialog(backgroundColor: const Color(0xFF1E1E2E), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)), title: const Text('Documents', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), content: const Text('No documents uploaded', style: TextStyle(color: Colors.white70)), actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Text('Close', style: TextStyle(color: Color(0xFF9333EA))))]));
  }
}
