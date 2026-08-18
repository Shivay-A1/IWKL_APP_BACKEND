import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../data/models/admin_player_model.dart';

class AdminPlayersScreen extends StatefulWidget {
  const AdminPlayersScreen({super.key});

  @override
  State<AdminPlayersScreen> createState() => _AdminPlayersScreenState();
}

class _AdminPlayersScreenState extends State<AdminPlayersScreen> {
  final List<AdminPlayerModel> _players = [];
  final TextEditingController _searchController = TextEditingController();
  String _selectedStatus = 'all';
  String _selectedPosition = 'all';

  @override
  void initState() {
    super.initState();
    _loadPlayers();
  }

  void _loadPlayers() {
    setState(() {
      _players.addAll([
        AdminPlayerModel(
          id: '1',
          photo: '',
          name: 'Rahul Kumar',
          jerseyNumber: 7,
          position: 'Raider',
          age: 25,
          dob: DateTime(1999, 5, 15),
          height: 175.0,
          weight: 72.0,
          state: 'Gujarat',
          teamId: '1',
          teamName: 'Gujarat Gems',
          phone: '+91-9876543210',
          email: 'rahul@example.com',
          status: 'active',
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
        AdminPlayerModel(
          id: '2',
          photo: '',
          name: 'Vikram Singh',
          jerseyNumber: 15,
          position: 'Defender',
          age: 28,
          dob: DateTime(1996, 8, 20),
          height: 180.0,
          weight: 78.0,
          state: 'Maharashtra',
          teamId: '2',
          teamName: 'Maharashtra Mavericks',
          phone: '+91-9876543211',
          email: 'vikram@example.com',
          status: 'active',
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      ]);
    });
  }

  List<AdminPlayerModel> get _filteredPlayers {
    var players = _players;
    if (_searchController.text.isNotEmpty) {
      players = players.where((player) =>
          player.name.toLowerCase().contains(_searchController.text.toLowerCase()) ||
          player.teamName.toLowerCase().contains(_searchController.text.toLowerCase())
      ).toList();
    }
    if (_selectedStatus != 'all') {
      players = players.where((player) => player.status == _selectedStatus).toList();
    }
    if (_selectedPosition != 'all') {
      players = players.where((player) => player.position == _selectedPosition).toList();
    }
    return players;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: const Text(
          'Players Management',
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
            onPressed: () => _showPlayerForm(),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search and Filter
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
                        hintText: 'Search players...',
                        hintStyle: TextStyle(color: Colors.white54),
                        prefixIcon: Icon(Icons.search, color: Color(0xFF9333EA)),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
                      onChanged: (value) => setState(() {}),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
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
                        DropdownMenuItem(value: 'active', child: Text('Active')),
                        DropdownMenuItem(value: 'inactive', child: Text('Inactive')),
                        DropdownMenuItem(value: 'injured', child: Text('Injured')),
                      ],
                      onChanged: (value) => setState(() => _selectedStatus = value ?? 'all'),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
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
                      value: _selectedPosition,
                      dropdownColor: const Color(0xFF1E1E2E),
                      style: const TextStyle(color: Colors.white),
                      items: const [
                        DropdownMenuItem(value: 'all', child: Text('All')),
                        DropdownMenuItem(value: 'Raider', child: Text('Raider')),
                        DropdownMenuItem(value: 'Defender', child: Text('Defender')),
                        DropdownMenuItem(value: 'All-Rounder', child: Text('All-Rounder')),
                      ],
                      onChanged: (value) => setState(() => _selectedPosition = value ?? 'all'),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Players List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _filteredPlayers.length,
              itemBuilder: (context, index) {
                final player = _filteredPlayers[index];
                return _buildPlayerCard(player, index);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlayerCard(AdminPlayerModel player, int index) {
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
      child: Row(
        children: [
          // Photo
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF4C085D).withOpacity(0.5),
                  const Color(0xFF6F1AB6).withOpacity(0.3),
                ],
              ),
            ),
            child: const Icon(Icons.person, size: 30, color: Colors.white),
          ),
          const SizedBox(width: 16),
          // Player Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  player.name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${player.teamName} • #${player.jerseyNumber} • ${player.position}',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.6),
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: player.status == 'active'
                            ? const Color(0xFF4CAF50).withOpacity(0.2)
                            : player.status == 'injured'
                                ? const Color(0xFFFF9800).withOpacity(0.2)
                                : const Color(0xFFF44336).withOpacity(0.2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        player.status.toUpperCase(),
                        style: TextStyle(
                          color: player.status == 'active'
                              ? const Color(0xFF4CAF50)
                              : player.status == 'injured'
                                  ? const Color(0xFFFF9800)
                                  : const Color(0xFFF44336),
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Actions
          IconButton(
            icon: const Icon(Icons.more_vert, color: Colors.white70),
            onPressed: () => _showPlayerMenu(player),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms, delay: (index * 50).ms);
  }

  void _showPlayerMenu(AdminPlayerModel player) {
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
              title: const Text('Edit Player', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(context);
                _showPlayerForm(player: player);
              },
            ),
            ListTile(
              leading: const Icon(Icons.visibility, color: Color(0xFF9333EA)),
              title: const Text('View Details', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(context);
                _viewPlayerDetails(player);
              },
            ),
            ListTile(
              leading: Icon(
                player.status == 'active' ? Icons.block : Icons.check_circle,
                color: player.status == 'active' ? Colors.red : Colors.green,
              ),
              title: Text(
                player.status == 'active' ? 'Deactivate' : 'Activate',
                style: const TextStyle(color: Colors.white),
              ),
              onTap: () {
                Navigator.pop(context);
                _togglePlayerStatus(player);
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete, color: Colors.red),
              title: const Text('Delete Player', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(context);
                _deletePlayer(player);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showPlayerForm({AdminPlayerModel? player}) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PlayerFormScreen(player: player),
      ),
    ).then((_) => _loadPlayers());
  }

  void _viewPlayerDetails(AdminPlayerModel player) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PlayerDetailScreen(player: player),
      ),
    );
  }

  void _deletePlayer(AdminPlayerModel player) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E1E2E),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text(
          'Delete Player',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        content: Text(
          'Are you sure you want to delete ${player.name}? This action cannot be undone.',
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Color(0xFF9333EA)),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _players.removeWhere((p) => p.id == player.id);
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Player deleted successfully'),
                  backgroundColor: Color(0xFF4CAF50),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            child: const Text(
              'Delete',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  void _togglePlayerStatus(AdminPlayerModel player) {
    setState(() {
      final index = _players.indexWhere((p) => p.id == player.id);
      if (index != -1) {
        _players[index] = player.copyWith(
          status: player.status == 'active' ? 'inactive' : 'active',
          updatedAt: DateTime.now(),
        );
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Player ${player.status == 'active' ? 'deactivated' : 'activated'} successfully'),
        backgroundColor: const Color(0xFF4CAF50),
      ),
    );
  }
}

class PlayerFormScreen extends StatefulWidget {
  final AdminPlayerModel? player;

  const PlayerFormScreen({super.key, this.player});

  @override
  State<PlayerFormScreen> createState() => _PlayerFormScreenState();
}

class _PlayerFormScreenState extends State<PlayerFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _jerseyNumberController = TextEditingController();
  final _ageController = TextEditingController();
  final _heightController = TextEditingController();
  final _weightController = TextEditingController();
  final _stateController = TextEditingController();
  final _teamIdController = TextEditingController();
  final _teamNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  String _position = 'Raider';
  String _status = 'active';
  DateTime? _dob;

  @override
  void initState() {
    super.initState();
    if (widget.player != null) {
      _nameController.text = widget.player!.name;
      _jerseyNumberController.text = widget.player!.jerseyNumber.toString();
      _ageController.text = widget.player!.age.toString();
      _heightController.text = widget.player!.height.toString();
      _weightController.text = widget.player!.weight.toString();
      _stateController.text = widget.player!.state;
      _teamIdController.text = widget.player!.teamId;
      _teamNameController.text = widget.player!.teamName;
      _phoneController.text = widget.player!.phone;
      _emailController.text = widget.player!.email;
      _position = widget.player!.position;
      _status = widget.player!.status;
      _dob = widget.player!.dob;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _jerseyNumberController.dispose();
    _ageController.dispose();
    _heightController.dispose();
    _weightController.dispose();
    _stateController.dispose();
    _teamIdController.dispose();
    _teamNameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _savePlayer() {
    if (_formKey.currentState!.validate()) {
      final player = AdminPlayerModel(
        id: widget.player?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
        photo: '',
        name: _nameController.text,
        jerseyNumber: int.parse(_jerseyNumberController.text),
        position: _position,
        age: int.parse(_ageController.text),
        dob: _dob ?? DateTime.now(),
        height: double.parse(_heightController.text),
        weight: double.parse(_weightController.text),
        state: _stateController.text,
        teamId: _teamIdController.text,
        teamName: _teamNameController.text,
        phone: _phoneController.text,
        email: _emailController.text,
        status: _status,
        createdAt: widget.player?.createdAt ?? DateTime.now(),
        updatedAt: DateTime.now(),
      );

      Navigator.pop(context, player);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(widget.player == null ? 'Player created successfully' : 'Player updated successfully'),
          backgroundColor: const Color(0xFF4CAF50),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: Text(
          widget.player == null ? 'Create Player' : 'Edit Player',
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          TextButton(
            onPressed: _savePlayer,
            child: const Text(
              'Save',
              style: TextStyle(
                color: Color(0xFF9333EA),
                fontWeight: FontWeight.bold,
              ),
            ),
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
              _buildTextField(
                controller: _nameController,
                label: 'Player Name *',
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Player name is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _jerseyNumberController,
                label: 'Jersey Number *',
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Jersey number is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
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
                    value: _position,
                    dropdownColor: const Color(0xFF1E1E2E),
                    style: const TextStyle(color: Colors.white),
                    isExpanded: true,
                    items: const [
                      DropdownMenuItem(value: 'Raider', child: Text('Raider')),
                      DropdownMenuItem(value: 'Defender', child: Text('Defender')),
                      DropdownMenuItem(value: 'All-Rounder', child: Text('All-Rounder')),
                    ],
                    onChanged: (value) => setState(() => _position = value ?? 'Raider'),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _ageController,
                label: 'Age *',
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Age is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              InkWell(
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: _dob ?? DateTime.now(),
                    firstDate: DateTime(1970),
                    lastDate: DateTime.now(),
                  );
                  if (picked != null) {
                    setState(() => _dob = picked);
                  }
                },
                child: Container(
                  padding: const EdgeInsets.all(16),
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
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today, color: Color(0xFF9333EA)),
                      const SizedBox(width: 12),
                      Text(
                        _dob != null ? _dob.toString().split(' ')[0] : 'Date of Birth *',
                        style: TextStyle(
                          color: _dob != null ? Colors.white : Colors.white54,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _heightController,
                label: 'Height (cm) *',
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Height is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _weightController,
                label: 'Weight (kg) *',
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Weight is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _stateController,
                label: 'State *',
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'State is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _teamNameController,
                label: 'Team Name *',
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Team name is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _phoneController,
                label: 'Phone *',
                keyboardType: TextInputType.phone,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Phone is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _emailController,
                label: 'Email *',
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Email is required';
                  }
                  if (!value.contains('@')) {
                    return 'Please enter a valid email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
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
                    value: _status,
                    dropdownColor: const Color(0xFF1E1E2E),
                    style: const TextStyle(color: Colors.white),
                    isExpanded: true,
                    items: const [
                      DropdownMenuItem(value: 'active', child: Text('Active')),
                      DropdownMenuItem(value: 'inactive', child: Text('Inactive')),
                      DropdownMenuItem(value: 'injured', child: Text('Injured')),
                    ],
                    onChanged: (value) => setState(() => _status = value ?? 'active'),
                  ),
                ),
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _savePlayer,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF9333EA),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Save Player',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Colors.white70,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          style: const TextStyle(color: Colors.white),
          keyboardType: keyboardType,
          validator: validator,
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.white.withOpacity(0.05),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: const Color(0xFF9333EA).withOpacity(0.3),
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: const Color(0xFF9333EA).withOpacity(0.3),
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF9333EA)),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Colors.red),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
        ),
      ],
    );
  }
}

class PlayerDetailScreen extends StatelessWidget {
  final AdminPlayerModel player;

  const PlayerDetailScreen({super.key, required this.player});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: Text(
          player.name,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF4C085D).withOpacity(0.5),
                      const Color(0xFF6F1AB6).withOpacity(0.3),
                    ],
                  ),
                ),
                child: const Icon(Icons.person, size: 60, color: Colors.white),
              ),
            ),
            const SizedBox(height: 24),
            _buildDetailCard('Basic Information', [
              _buildDetailRow('Name', player.name),
              _buildDetailRow('Jersey Number', '#${player.jerseyNumber}'),
              _buildDetailRow('Position', player.position),
              _buildDetailRow('Age', '${player.age} years'),
              _buildDetailRow('Date of Birth', player.dob.toString().split(' ')[0]),
              _buildDetailRow('Height', '${player.height} cm'),
              _buildDetailRow('Weight', '${player.weight} kg'),
            ]),
            const SizedBox(height: 16),
            _buildDetailCard('Team Information', [
              _buildDetailRow('Team', player.teamName),
              _buildDetailRow('State', player.state),
            ]),
            const SizedBox(height: 16),
            _buildDetailCard('Contact Information', [
              _buildDetailRow('Phone', player.phone),
              _buildDetailRow('Email', player.email),
            ]),
            const SizedBox(height: 16),
            _buildDetailCard('Status', [
              _buildDetailRow('Status', player.status.toUpperCase()),
              _buildDetailRow('Created At', player.createdAt.toString().split('.')[0]),
              _buildDetailRow('Updated At', player.updatedAt.toString().split('.')[0]),
            ]),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailCard(String title, List<Widget> children) {
    return Container(
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
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          ...children,
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: TextStyle(
                color: Colors.white.withOpacity(0.6),
                fontSize: 14,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
