import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/theme/admin_design_system.dart';
import '../../data/models/admin_team_model.dart';

class AdminTeamsScreen extends StatefulWidget {
  const AdminTeamsScreen({super.key});

  @override
  State<AdminTeamsScreen> createState() => _AdminTeamsScreenState();
}

class _AdminTeamsScreenState extends State<AdminTeamsScreen> {
  final List<AdminTeamModel> _teams = [];
  final TextEditingController _searchController = TextEditingController();
  String _selectedStatus = 'all';

  @override
  void initState() {
    super.initState();
    _loadTeams();
  }

  void _loadTeams() {
    // Load teams from local storage or API
    // For now, adding dummy data
    setState(() {
      _teams.addAll([
        AdminTeamModel(
          id: '1',
          name: 'Gujarat Gems',
          shortName: 'GG',
          slug: 'gujarat-gems',
          logo: '',
          primaryColor: '#9333EA',
          secondaryColor: '#4C085D',
          accentColor: '#EC4899',
          description: 'Gujarat Gems - Shining Bright',
          state: 'Gujarat',
          coach: 'Rajesh Kumar',
          captain: 'Vikram Singh',
          foundedYear: 2024,
          status: 'active',
          displayOrder: 1,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
        AdminTeamModel(
          id: '2',
          name: 'Maharashtra Mavericks',
          shortName: 'MM',
          slug: 'maharashtra-mavericks',
          logo: '',
          primaryColor: '#FF5722',
          secondaryColor: '#E64A19',
          accentColor: '#FF7043',
          description: 'Maharashtra Mavericks - Unstoppable Force',
          state: 'Maharashtra',
          coach: 'Suresh Patel',
          captain: 'Amit Sharma',
          foundedYear: 2024,
          status: 'active',
          displayOrder: 2,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      ]);
    });
  }

  List<AdminTeamModel> get _filteredTeams {
    var teams = _teams;
    if (_searchController.text.isNotEmpty) {
      teams = teams.where((team) =>
          team.name.toLowerCase().contains(_searchController.text.toLowerCase()) ||
          team.shortName.toLowerCase().contains(_searchController.text.toLowerCase())
      ).toList();
    }
    if (_selectedStatus != 'all') {
      teams = teams.where((team) => team.status == _selectedStatus).toList();
    }
    return teams;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: const Text(
          'Teams Management',
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
            onPressed: () => _showTeamForm(),
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
                    decoration: AdminDesignSystem.adminCardDecoration,
                    child: TextField(
                      controller: _searchController,
                      style: AdminDesignSystem.adminBody,
                      decoration: InputDecoration(
                        hintText: 'Search teams...',
                        hintStyle: TextStyle(color: AdminDesignSystem.adminMuted),
                        prefixIcon: Icon(Icons.search, color: AdminDesignSystem.adminMuted),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
                        DropdownMenuItem(value: 'active', child: Text('Active')),
                        DropdownMenuItem(value: 'inactive', child: Text('Inactive')),
                      ],
                      onChanged: (value) => setState(() => _selectedStatus = value ?? 'all'),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Teams List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _filteredTeams.length,
              itemBuilder: (context, index) {
                final team = _filteredTeams[index];
                return _buildTeamCard(team, index);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTeamCard(AdminTeamModel team, int index) {
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
              // Logo
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
                child: const Icon(Icons.groups, size: 30, color: Colors.white),
              ),
              const SizedBox(width: 16),
              // Team Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      team.name,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${team.shortName} • ${team.state}',
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
                            color: team.status == 'active'
                                ? const Color(0xFF4CAF50).withOpacity(0.2)
                                : const Color(0xFFF44336).withOpacity(0.2),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            team.status.toUpperCase(),
                            style: TextStyle(
                              color: team.status == 'active'
                                  ? const Color(0xFF4CAF50)
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
                onPressed: () => _showTeamMenu(team),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Action Buttons
          Row(
            children: [
              Expanded(
                child: _buildActionButton(Icons.edit, 'Edit', () => _showTeamForm(team: team)),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildActionButton(Icons.visibility, 'View', () => _viewTeamDetails(team)),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildActionButton(Icons.delete, 'Delete', () => _deleteTeam(team)),
              ),
            ],
          ),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms, delay: (index * 50).ms);
  }

  Widget _buildActionButton(IconData icon, String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 16, color: const Color(0xFF9333EA)),
            const SizedBox(width: 4),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showTeamMenu(AdminTeamModel team) {
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
              title: const Text('Edit Team', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(context);
                _showTeamForm(team: team);
              },
            ),
            ListTile(
              leading: const Icon(Icons.visibility, color: Color(0xFF9333EA)),
              title: const Text('View Details', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(context);
                _viewTeamDetails(team);
              },
            ),
            ListTile(
              leading: Icon(
                team.status == 'active' ? Icons.block : Icons.check_circle,
                color: team.status == 'active' ? Colors.red : Colors.green,
              ),
              title: Text(
                team.status == 'active' ? 'Deactivate' : 'Activate',
                style: const TextStyle(color: Colors.white),
              ),
              onTap: () {
                Navigator.pop(context);
                _toggleTeamStatus(team);
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete, color: Colors.red),
              title: const Text('Delete Team', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(context);
                _deleteTeam(team);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showTeamForm({AdminTeamModel? team}) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TeamFormScreen(team: team),
      ),
    ).then((_) => _loadTeams());
  }

  void _viewTeamDetails(AdminTeamModel team) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TeamDetailScreen(team: team),
      ),
    );
  }

  void _deleteTeam(AdminTeamModel team) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E1E2E),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text(
          'Delete Team',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        content: Text(
          'Are you sure you want to delete ${team.name}? This action cannot be undone.',
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
                _teams.removeWhere((t) => t.id == team.id);
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Team deleted successfully'),
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

  void _toggleTeamStatus(AdminTeamModel team) {
    setState(() {
      final index = _teams.indexWhere((t) => t.id == team.id);
      if (index != -1) {
        _teams[index] = team.copyWith(
          status: team.status == 'active' ? 'inactive' : 'active',
          updatedAt: DateTime.now(),
        );
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Team ${team.status == 'active' ? 'deactivated' : 'activated'} successfully'),
        backgroundColor: const Color(0xFF4CAF50),
      ),
    );
  }
}

class TeamFormScreen extends StatefulWidget {
  final AdminTeamModel? team;

  const TeamFormScreen({super.key, this.team});

  @override
  State<TeamFormScreen> createState() => _TeamFormScreenState();
}

class _TeamFormScreenState extends State<TeamFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _shortNameController = TextEditingController();
  final _slugController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _stateController = TextEditingController();
  final _coachController = TextEditingController();
  final _captainController = TextEditingController();
  final _foundedYearController = TextEditingController();
  final _displayOrderController = TextEditingController();
  final _primaryColorController = TextEditingController(text: '#9333EA');
  final _secondaryColorController = TextEditingController(text: '#4C085D');
  final _accentColorController = TextEditingController(text: '#EC4899');
  String _status = 'active';

  @override
  void initState() {
    super.initState();
    if (widget.team != null) {
      _nameController.text = widget.team!.name;
      _shortNameController.text = widget.team!.shortName;
      _slugController.text = widget.team!.slug;
      _descriptionController.text = widget.team!.description;
      _stateController.text = widget.team!.state;
      _coachController.text = widget.team!.coach;
      _captainController.text = widget.team!.captain;
      _foundedYearController.text = widget.team!.foundedYear.toString();
      _displayOrderController.text = widget.team!.displayOrder.toString();
      _primaryColorController.text = widget.team!.primaryColor;
      _secondaryColorController.text = widget.team!.secondaryColor;
      _accentColorController.text = widget.team!.accentColor;
      _status = widget.team!.status;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _shortNameController.dispose();
    _slugController.dispose();
    _descriptionController.dispose();
    _stateController.dispose();
    _coachController.dispose();
    _captainController.dispose();
    _foundedYearController.dispose();
    _displayOrderController.dispose();
    _primaryColorController.dispose();
    _secondaryColorController.dispose();
    _accentColorController.dispose();
    super.dispose();
  }

  void _saveTeam() {
    if (_formKey.currentState!.validate()) {
      final team = AdminTeamModel(
        id: widget.team?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
        name: _nameController.text,
        shortName: _shortNameController.text,
        slug: _slugController.text,
        logo: '',
        primaryColor: _primaryColorController.text,
        secondaryColor: _secondaryColorController.text,
        accentColor: _accentColorController.text,
        description: _descriptionController.text,
        state: _stateController.text,
        coach: _coachController.text,
        captain: _captainController.text,
        foundedYear: int.parse(_foundedYearController.text),
        status: _status,
        displayOrder: int.parse(_displayOrderController.text),
        createdAt: widget.team?.createdAt ?? DateTime.now(),
        updatedAt: DateTime.now(),
      );

      Navigator.pop(context, team);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(widget.team == null ? 'Team created successfully' : 'Team updated successfully'),
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
          widget.team == null ? 'Create Team' : 'Edit Team',
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
            onPressed: _saveTeam,
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
              _buildSectionTitle('Basic Information'),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _nameController,
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
                controller: _shortNameController,
                label: 'Short Name *',
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Short name is required';
                  }
                  if (value.length > 3) {
                    return 'Short name must be 3 characters or less';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _slugController,
                label: 'Slug *',
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Slug is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _descriptionController,
                label: 'Description *',
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Description is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              _buildSectionTitle('Team Details'),
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
                controller: _coachController,
                label: 'Coach *',
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Coach is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _captainController,
                label: 'Captain *',
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Captain is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _foundedYearController,
                label: 'Founded Year *',
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Founded year is required';
                  }
                  final year = int.tryParse(value);
                  if (year == null || year < 1900 || year > DateTime.now().year) {
                    return 'Please enter a valid year';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _displayOrderController,
                label: 'Display Order',
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 24),
              _buildSectionTitle('Theme Colors'),
              const SizedBox(height: 16),
              _buildColorField(
                controller: _primaryColorController,
                label: 'Primary Color *',
              ),
              const SizedBox(height: 16),
              _buildColorField(
                controller: _secondaryColorController,
                label: 'Secondary Color *',
              ),
              const SizedBox(height: 16),
              _buildColorField(
                controller: _accentColorController,
                label: 'Accent Color *',
              ),
              const SizedBox(height: 24),
              _buildSectionTitle('Status'),
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
                  onPressed: _saveTeam,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF9333EA),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Save Team',
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

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        color: Colors.white,
        fontSize: 18,
        fontWeight: FontWeight.bold,
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    int maxLines = 1,
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
          maxLines: maxLines,
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

  Widget _buildColorField({
    required TextEditingController controller,
    required String label,
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
        Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: Color(int.parse(controller.text.replaceFirst('#', '0xFF'))),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.white.withOpacity(0.3)),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextFormField(
                controller: controller,
                style: const TextStyle(color: Colors.white),
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
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class TeamDetailScreen extends StatelessWidget {
  final AdminTeamModel team;

  const TeamDetailScreen({super.key, required this.team});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: Text(
          team.name,
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
            // Logo
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
                child: const Icon(Icons.groups, size: 60, color: Colors.white),
              ),
            ),
            const SizedBox(height: 24),
            // Basic Info
            _buildDetailCard('Basic Information', [
              _buildDetailRow('Team Name', team.name),
              _buildDetailRow('Short Name', team.shortName),
              _buildDetailRow('Slug', team.slug),
              _buildDetailRow('Description', team.description),
            ]),
            const SizedBox(height: 16),
            // Team Details
            _buildDetailCard('Team Details', [
              _buildDetailRow('State', team.state),
              _buildDetailRow('Coach', team.coach),
              _buildDetailRow('Captain', team.captain),
              _buildDetailRow('Founded Year', team.foundedYear.toString()),
              _buildDetailRow('Display Order', team.displayOrder.toString()),
            ]),
            const SizedBox(height: 16),
            // Theme Colors
            _buildDetailCard('Theme Colors', [
              _buildColorRow('Primary Color', team.primaryColor),
              _buildColorRow('Secondary Color', team.secondaryColor),
              _buildColorRow('Accent Color', team.accentColor),
            ]),
            const SizedBox(height: 16),
            // Status
            _buildDetailCard('Status', [
              _buildDetailRow('Status', team.status.toUpperCase()),
              _buildDetailRow('Created At', team.createdAt.toString().split('.')[0]),
              _buildDetailRow('Updated At', team.updatedAt.toString().split('.')[0]),
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

  Widget _buildColorRow(String label, String color) {
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
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Color(int.parse(color.replaceFirst('#', '0xFF'))),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.white.withOpacity(0.3)),
            ),
          ),
          const SizedBox(width: 12),
          Text(
            color,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
