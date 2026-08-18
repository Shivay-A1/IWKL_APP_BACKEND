import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../data/models/admin_match_model.dart';

class AdminMatchesScreen extends StatefulWidget {
  const AdminMatchesScreen({super.key});

  @override
  State<AdminMatchesScreen> createState() => _AdminMatchesScreenState();
}

class _AdminMatchesScreenState extends State<AdminMatchesScreen> {
  final List<AdminMatchModel> _matches = [];
  final TextEditingController _searchController = TextEditingController();
  String _selectedStatus = 'all';

  @override
  void initState() {
    super.initState();
    _loadMatches();
  }

  void _loadMatches() {
    setState(() {
      _matches.addAll([
        AdminMatchModel(
          id: '1',
          teamAId: '1',
          teamAName: 'Gujarat Gems',
          teamBId: '2',
          teamBName: 'Maharashtra Mavericks',
          venue: 'Mumbai Arena',
          date: DateTime(2024, 12, 15),
          time: '19:00',
          leagueStage: 'Group Stage',
          referee: 'Ramesh Kumar',
          liveStatus: 'not_started',
          matchStatus: 'scheduled',
          teamAScore: 0,
          teamBScore: 0,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      ]);
    });
  }

  List<AdminMatchModel> get _filteredMatches {
    var matches = _matches;
    if (_searchController.text.isNotEmpty) {
      matches = matches.where((match) =>
          match.teamAName.toLowerCase().contains(_searchController.text.toLowerCase()) ||
          match.teamBName.toLowerCase().contains(_searchController.text.toLowerCase())
      ).toList();
    }
    if (_selectedStatus != 'all') {
      matches = matches.where((match) => match.matchStatus == _selectedStatus).toList();
    }
    return matches;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: const Text(
          'Matches Management',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add, color: Colors.white),
            onPressed: () => _showMatchForm(),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.white.withOpacity(0.05),
                          Colors.white.withOpacity(0.02),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: const Color(0xFF9333EA).withOpacity(0.3),
                      ),
                    ),
                    child: TextField(
                      controller: _searchController,
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(
                        hintText: 'Search matches...',
                        hintStyle: TextStyle(color: Colors.white54),
                        prefixIcon: Icon(Icons.search, color: Color(0xFF9333EA)),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
                      onChanged: (value) => setState(() {}),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.white.withOpacity(0.05),
                        Colors.white.withOpacity(0.02),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: const Color(0xFF9333EA).withOpacity(0.3),
                    ),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedStatus,
                      dropdownColor: const Color(0xFF1E1E2E),
                      style: const TextStyle(color: Colors.white),
                      items: const [
                        DropdownMenuItem(value: 'all', child: Text('All')),
                        DropdownMenuItem(value: 'scheduled', child: Text('Scheduled')),
                        DropdownMenuItem(value: 'in_progress', child: Text('In Progress')),
                        DropdownMenuItem(value: 'completed', child: Text('Completed')),
                        DropdownMenuItem(value: 'cancelled', child: Text('Cancelled')),
                      ],
                      onChanged: (value) => setState(() => _selectedStatus = value ?? 'all'),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _filteredMatches.length,
              itemBuilder: (context, index) {
                final match = _filteredMatches[index];
                return _buildMatchCard(match, index);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMatchCard(AdminMatchModel match, int index) {
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
          color: const Color(0xFF9333EA).withOpacity(0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Column(
                      children: [
                        const Icon(Icons.groups, color: Color(0xFF9333EA), size: 30),
                        const SizedBox(height: 4),
                        Text(
                          match.teamAName,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          match.teamAScore.toString(),
                          style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(width: 16),
                    const Text('VS', style: TextStyle(color: Colors.white54, fontSize: 18)),
                    const SizedBox(width: 16),
                    Column(
                      children: [
                        const Icon(Icons.groups, color: Color(0xFFEC4899), size: 30),
                        const SizedBox(height: 4),
                        Text(
                          match.teamBName,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          match.teamBScore.toString(),
                          style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.more_vert, color: Colors.white70),
                onPressed: () => _showMatchMenu(match),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Icon(Icons.calendar_today, size: 16, color: Colors.white54),
              const SizedBox(width: 4),
              Text(
                '${match.date.toString().split(' ')[0]} at ${match.time}',
                style: TextStyle(color: Colors.white54, fontSize: 12),
              ),
              const SizedBox(width: 16),
              Icon(Icons.location_on, size: 16, color: Colors.white54),
              const SizedBox(width: 4),
              Text(
                match.venue,
                style: TextStyle(color: Colors.white54, fontSize: 12),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: match.liveStatus == 'live'
                      ? Colors.red.withOpacity(0.2)
                      : match.matchStatus == 'completed'
                          ? Colors.green.withOpacity(0.2)
                          : Colors.blue.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  match.liveStatus == 'live' ? 'LIVE' : match.matchStatus.toUpperCase(),
                  style: TextStyle(
                    color: match.liveStatus == 'live'
                        ? Colors.red
                        : match.matchStatus == 'completed'
                            ? Colors.green
                            : Colors.blue,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms, delay: (index * 50).ms);
  }

  void _showMatchMenu(AdminMatchModel match) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1E1E2E),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.edit, color: Color(0xFF9333EA)),
              title: const Text('Edit Match', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(context);
                _showMatchForm(match: match);
              },
            ),
            ListTile(
              leading: const Icon(Icons.scoreboard, color: Color(0xFF9333EA)),
              title: const Text('Update Score', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(context);
                _updateScore(match);
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete, color: Colors.red),
              title: const Text('Delete Match', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(context);
                _deleteMatch(match);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showMatchForm({AdminMatchModel? match}) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MatchFormScreen(match: match),
      ),
    ).then((_) => _loadMatches());
  }

  void _updateScore(AdminMatchModel match) {
    final _teamAScoreController = TextEditingController(text: match.teamAScore.toString());
    final _teamBScoreController = TextEditingController(text: match.teamBScore.toString());

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E1E2E),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text(
          'Update Score',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('${match.teamAName} Score'),
            const SizedBox(height: 8),
            TextField(
              controller: _teamAScoreController,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                filled: true,
                fillColor: Colors.white.withOpacity(0.05),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: const Color(0xFF9333EA).withOpacity(0.3)),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text('${match.teamBName} Score'),
            const SizedBox(height: 8),
            TextField(
              controller: _teamBScoreController,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                filled: true,
                fillColor: Colors.white.withOpacity(0.05),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: const Color(0xFF9333EA).withOpacity(0.3)),
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF9333EA))),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                final index = _matches.indexWhere((m) => m.id == match.id);
                if (index != -1) {
                  _matches[index] = match.copyWith(
                    teamAScore: int.parse(_teamAScoreController.text),
                    teamBScore: int.parse(_teamBScoreController.text),
                    updatedAt: DateTime.now(),
                  );
                }
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Score updated successfully'), backgroundColor: Color(0xFF4CAF50)),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF9333EA)),
            child: const Text('Update', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _deleteMatch(AdminMatchModel match) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E1E2E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Delete Match', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        content: Text('Are you sure you want to delete this match?', style: const TextStyle(color: Colors.white70)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel', style: TextStyle(color: Color(0xFF9333EA)))),
          ElevatedButton(
            onPressed: () {
              setState(() => _matches.removeWhere((m) => m.id == match.id));
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Match deleted successfully'), backgroundColor: Color(0xFF4CAF50)));
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}

class MatchFormScreen extends StatefulWidget {
  final AdminMatchModel? match;

  const MatchFormScreen({super.key, this.match});

  @override
  State<MatchFormScreen> createState() => _MatchFormScreenState();
}

class _MatchFormScreenState extends State<MatchFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _teamAController = TextEditingController();
  final _teamBController = TextEditingController();
  final _venueController = TextEditingController();
  final _timeController = TextEditingController(text: '19:00');
  final _refereeController = TextEditingController();
  String _leagueStage = 'Group Stage';
  String _matchStatus = 'scheduled';
  DateTime? _date;

  @override
  void initState() {
    super.initState();
    if (widget.match != null) {
      _teamAController.text = widget.match!.teamAName;
      _teamBController.text = widget.match!.teamBName;
      _venueController.text = widget.match!.venue;
      _timeController.text = widget.match!.time;
      _refereeController.text = widget.match!.referee;
      _leagueStage = widget.match!.leagueStage;
      _matchStatus = widget.match!.matchStatus;
      _date = widget.match!.date;
    }
  }

  @override
  void dispose() {
    _teamAController.dispose();
    _teamBController.dispose();
    _venueController.dispose();
    _timeController.dispose();
    _refereeController.dispose();
    super.dispose();
  }

  void _saveMatch() {
    if (_formKey.currentState!.validate()) {
      final match = AdminMatchModel(
        id: widget.match?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
        teamAId: '1',
        teamAName: _teamAController.text,
        teamBId: '2',
        teamBName: _teamBController.text,
        venue: _venueController.text,
        date: _date ?? DateTime.now(),
        time: _timeController.text,
        leagueStage: _leagueStage,
        referee: _refereeController.text,
        liveStatus: 'not_started',
        matchStatus: _matchStatus,
        teamAScore: widget.match?.teamAScore ?? 0,
        teamBScore: widget.match?.teamBScore ?? 0,
        createdAt: widget.match?.createdAt ?? DateTime.now(),
        updatedAt: DateTime.now(),
      );
      Navigator.pop(context, match);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(widget.match == null ? 'Match created successfully' : 'Match updated successfully'), backgroundColor: const Color(0xFF4CAF50)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: Text(widget.match == null ? 'Create Match' : 'Edit Match', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => Navigator.pop(context)),
        actions: [
          TextButton(
            onPressed: _saveMatch,
            child: const Text('Save', style: TextStyle(color: Color(0xFF9333EA), fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildTextField(controller: _teamAController, label: 'Team A Name *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
              const SizedBox(height: 16),
              _buildTextField(controller: _teamBController, label: 'Team B Name *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
              const SizedBox(height: 16),
              _buildTextField(controller: _venueController, label: 'Venue *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
              const SizedBox(height: 16),
              InkWell(
                onTap: () async {
                  final picked = await showDatePicker(context: context, initialDate: _date ?? DateTime.now(), firstDate: DateTime.now(), lastDate: DateTime(2025));
                  if (picked != null) setState(() => _date = picked);
                },
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))),
                  child: Row(children: [const Icon(Icons.calendar_today, color: Color(0xFF9333EA)), const SizedBox(width: 12), Text(_date != null ? _date.toString().split(' ')[0] : 'Date *', style: TextStyle(color: _date != null ? Colors.white : Colors.white54))]),
                ),
              ),
              const SizedBox(height: 16),
              _buildTextField(controller: _timeController, label: 'Time *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
              const SizedBox(height: 16),
              _buildDropdown(label: 'League Stage', value: _leagueStage, items: ['Group Stage', 'Quarter Final', 'Semi Final', 'Final'], onChanged: (v) => setState(() => _leagueStage = v)),
              const SizedBox(height: 16),
              _buildTextField(controller: _refereeController, label: 'Referee *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
              const SizedBox(height: 16),
              _buildDropdown(label: 'Match Status', value: _matchStatus, items: ['scheduled', 'in_progress', 'completed', 'cancelled'], onChanged: (v) => setState(() => _matchStatus = v)),
              const SizedBox(height: 32),
              SizedBox(width: double.infinity, height: 50, child: ElevatedButton(onPressed: _saveMatch, style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF9333EA), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))), child: const Text('Save Match', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)))),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({required TextEditingController controller, required String label, String? Function(String?)? validator}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w500)),
      const SizedBox(height: 8),
      TextFormField(controller: controller, style: const TextStyle(color: Colors.white), validator: validator, decoration: InputDecoration(filled: true, fillColor: Colors.white.withOpacity(0.05), border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: const Color(0xFF9333EA).withOpacity(0.3))), enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: const Color(0xFF9333EA).withOpacity(0.3))), focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF9333EA))), errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.red)), contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12))),
    ]);
  }

  Widget _buildDropdown({required String label, required String value, required List<String> items, required Function(String) onChanged}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w500)),
      const SizedBox(height: 8),
      Container(padding: const EdgeInsets.symmetric(horizontal: 16), decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: DropdownButtonHideUnderline(child: DropdownButton<String>(value: value, dropdownColor: const Color(0xFF1E1E2E), style: const TextStyle(color: Colors.white), isExpanded: true, items: items.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(), onChanged: (v) => onChanged(v ?? value)))),
    ]);
  }
}
