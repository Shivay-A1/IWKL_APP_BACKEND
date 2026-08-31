import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../data/models/admin_points_table_model.dart';

class AdminPointsTableScreen extends StatefulWidget {
  const AdminPointsTableScreen({super.key});

  @override
  State<AdminPointsTableScreen> createState() => _AdminPointsTableScreenState();
}

class _AdminPointsTableScreenState extends State<AdminPointsTableScreen> {
  final List<AdminPointsTableModel> _pointsTable = [];
  final _formKey = GlobalKey<FormState>();
  final _teamController = TextEditingController();
  final _playedController = TextEditingController(text: '0');
  final _wonController = TextEditingController(text: '0');
  final _lostController = TextEditingController(text: '0');
  final _tieController = TextEditingController(text: '0');
  final _pointsController = TextEditingController(text: '0');
  final _scoreDiffController = TextEditingController(text: '0');

  @override
  void initState() {
    super.initState();
    _loadPointsTable();
  }

  void _loadPointsTable() {
    setState(() {
      _pointsTable.addAll([
        AdminPointsTableModel(
          id: '1',
          teamId: '1',
          teamName: 'Gujarat Gems',
          played: 5,
          won: 3,
          lost: 1,
          tie: 1,
          points: 10,
          scoreDifference: 15,
          rank: 1,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      ]);
    });
  }

  void _addEntry() {
    if (_formKey.currentState!.validate()) {
      final entry = AdminPointsTableModel(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        teamId: '1',
        teamName: _teamController.text,
        played: int.parse(_playedController.text),
        won: int.parse(_wonController.text),
        lost: int.parse(_lostController.text),
        tie: int.parse(_tieController.text),
        points: int.parse(_pointsController.text),
        scoreDifference: int.parse(_scoreDiffController.text),
        rank: _pointsTable.length + 1,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      setState(() => _pointsTable.add(entry));
      _teamController.clear();
      _playedController.text = '0';
      _wonController.text = '0';
      _lostController.text = '0';
      _tieController.text = '0';
      _pointsController.text = '0';
      _scoreDiffController.text = '0';
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Entry added'), backgroundColor: Color(0xFF4CAF50)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(backgroundColor: const Color(0xFF13051E), elevation: 0, title: const Text('Points Table', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => Navigator.pop(context))),
      body: Column(
        children: [
          Container(margin: const EdgeInsets.all(16), padding: const EdgeInsets.all(16), decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: Form(key: _formKey, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Add Entry', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildField(_teamController, 'Team Name *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 8),
            Row(children: [Expanded(child: _buildField(_playedController, 'Played', keyboardType: TextInputType.number)), const SizedBox(width: 8), Expanded(child: _buildField(_wonController, 'Won', keyboardType: TextInputType.number))]),
            const SizedBox(height: 8),
            Row(children: [Expanded(child: _buildField(_lostController, 'Lost', keyboardType: TextInputType.number)), const SizedBox(width: 8), Expanded(child: _buildField(_tieController, 'Tie', keyboardType: TextInputType.number))]),
            const SizedBox(height: 8),
            Row(children: [Expanded(child: _buildField(_pointsController, 'Points', keyboardType: TextInputType.number)), const SizedBox(width: 8), Expanded(child: _buildField(_scoreDiffController, 'Score Diff', keyboardType: TextInputType.number))]),
            const SizedBox(height: 12),
            SizedBox(width: double.infinity, height: 40, child: ElevatedButton(onPressed: _addEntry, style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF9333EA), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))), child: const Text('Add Entry', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)))),
          ]))),
          Expanded(child: ListView.builder(padding: const EdgeInsets.symmetric(horizontal: 16), itemCount: _pointsTable.length, itemBuilder: (context, index) {
            final entry = _pointsTable[index];
            return Container(margin: const EdgeInsets.only(bottom: 8), padding: const EdgeInsets.all(12), decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: Row(children: [
              Container(width: 30, height: 30, decoration: BoxDecoration(color: const Color(0xFF9333EA), borderRadius: BorderRadius.circular(8)), child: Center(child: Text('#${entry.rank}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)))),
              const SizedBox(width: 12),
              Expanded(child: Text(entry.teamName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
              Text('P: ${entry.played}', style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
              const SizedBox(width: 16),
              Text('W: ${entry.won}', style: TextStyle(color: Colors.green, fontSize: 12)),
              const SizedBox(width: 16),
              Text('Pts: ${entry.points}', style: const TextStyle(color: Color(0xFF9333EA), fontSize: 12, fontWeight: FontWeight.bold)),
              IconButton(icon: const Icon(Icons.delete, color: Colors.red, size: 20), onPressed: () => setState(() => _pointsTable.removeWhere((e) => e.id == entry.id))),
            ]));
          })),
        ],
      ),
    );
  }

  Widget _buildField(TextEditingController controller, String label, {TextInputType? keyboardType, String? Function(String?)? validator}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w500)),
      const SizedBox(height: 4),
      TextFormField(controller: controller, style: const TextStyle(color: Colors.white), keyboardType: keyboardType, validator: validator, decoration: InputDecoration(filled: true, fillColor: Colors.white.withOpacity(0.05), border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: const Color(0xFF9333EA).withOpacity(0.3))), contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8))),
    ]);
  }
}
