import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/constants/app_constants.dart';
import '../../data/models/admin_fan_club_model.dart';
import '../../../fan_club/data/services/fan_club_service.dart';

class AdminFanClubScreen extends StatefulWidget {
  const AdminFanClubScreen({super.key});

  @override
  State<AdminFanClubScreen> createState() => _AdminFanClubScreenState();
}

class _AdminFanClubScreenState extends State<AdminFanClubScreen> {
  List<AdminFanClubModel> _allMembers = [];
  List<AdminFanClubModel> _filteredMembers = [];
  bool _isLoading = true;
  String _searchQuery = '';
  String? _selectedTeamFilter;
  String? _selectedStateFilter;
  Map<String, int> _statistics = {};

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final members = await FanClubService.getAllMembers();
      final stats = await FanClubService.getStatistics();

      setState(() {
        _allMembers = members;
        _filteredMembers = members;
        _statistics = stats;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to load data: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _applyFilters() {
    setState(() {
      _filteredMembers = _allMembers;

      // Apply search filter
      if (_searchQuery.isNotEmpty) {
        _filteredMembers = _filteredMembers.where((member) =>
          member.fullName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          member.mobile.contains(_searchQuery) ||
          member.city.toLowerCase().contains(_searchQuery.toLowerCase())
        ).toList();
      }

      // Apply team filter
      if (_selectedTeamFilter != null) {
        _filteredMembers = _filteredMembers.where((member) =>
          member.supportedTeam == _selectedTeamFilter
        ).toList();
      }

      // Apply state filter
      if (_selectedStateFilter != null) {
        _filteredMembers = _filteredMembers.where((member) =>
          member.state == _selectedStateFilter
        ).toList();
      }
    });
  }

  Future<void> _deleteMember(AdminFanClubModel member) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF240833),
        title: const Text(
          'Delete Member',
          style: TextStyle(color: Colors.white),
        ),
        content: Text(
          'Are you sure you want to delete ${member.fullName}?',
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF9333EA))),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final success = await FanClubService.deleteMember(member.id);
      if (success) {
        setState(() {
          _allMembers.remove(member);
          _applyFilters();
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Member deleted successfully'),
              backgroundColor: Colors.green,
            ),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Failed to delete member'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  void _showMemberDetails(AdminFanClubModel member) {
    showDialog(
      context: context,
      builder: (context) => _MemberDetailsDialog(
        member: member,
        onDelete: () {
          Navigator.pop(context);
          _deleteMember(member);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Statistics Cards
                _buildStatisticsSection(),
                const SizedBox(height: 20),
                // Filters
                _buildFiltersSection(),
                const SizedBox(height: 20),
                // Members List
                Expanded(
                  child: _filteredMembers.isEmpty
                      ? _buildEmptyState()
                      : _buildMembersList(),
                ),
              ],
            ),
    );
  }

  Widget _buildStatisticsSection() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Row(
        children: [
          _buildStatCard(
            'Total Members',
            _statistics['totalMembers']?.toString() ?? '0',
            Icons.people,
            const Color(0xFF9333EA),
          ),
          const SizedBox(width: 12),
          // Team statistics
          ...AppConstants.allTeams.take(4).map((team) {
            final count = _statistics[team] ?? 0;
            if (count == 0) return const SizedBox.shrink();
            return Padding(
              padding: const EdgeInsets.only(right: 12),
              child: _buildStatCard(
                team,
                count.toString(),
                Icons.emoji_events,
                Color(AppConstants.teamColors[team] ?? 0xFF9333EA),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      width: 160,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            color.withOpacity(0.2),
            color.withOpacity(0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(
              color: Colors.white.withOpacity(0.7),
              fontSize: 12,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildFiltersSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          // Search Bar
          Container(
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
              onChanged: (value) {
                setState(() {
                  _searchQuery = value;
                });
                _applyFilters();
              },
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Search members...',
                hintStyle: TextStyle(
                  color: Colors.white.withOpacity(0.3),
                ),
                prefixIcon: const Icon(
                  Icons.search,
                  color: Color(0xFF9333EA),
                ),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, color: Color(0xFF9333EA)),
                        onPressed: () {
                          setState(() {
                            _searchQuery = '';
                          });
                          _applyFilters();
                        },
                      )
                    : null,
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 16,
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          // Filter Dropdowns
          Row(
            children: [
              Expanded(
                child: _buildFilterDropdown(
                  'Filter by Team',
                  _selectedTeamFilter,
                  AppConstants.allTeams,
                  (value) {
                    setState(() {
                      _selectedTeamFilter = value;
                    });
                    _applyFilters();
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildFilterDropdown(
                  'Filter by State',
                  _selectedStateFilter,
                  _getUniqueStates(),
                  (value) {
                    setState(() {
                      _selectedStateFilter = value;
                    });
                    _applyFilters();
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFilterDropdown(
    String hint,
    String? value,
    List<String> items,
    Function(String?) onChanged,
  ) {
    return Container(
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
        child: DropdownButtonFormField<String>(
          value: value,
          hint: Text(
            hint,
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 14,
            ),
          ),
          items: [
            const DropdownMenuItem<String>(
              value: null,
              child: Text('All', style: TextStyle(color: Colors.white)),
            ),
            ...items.map((String item) {
              return DropdownMenuItem<String>(
                value: item,
                child: Text(
                  item,
                  style: const TextStyle(color: Colors.white),
                  overflow: TextOverflow.ellipsis,
                ),
              );
            }),
          ],
          onChanged: onChanged,
          dropdownColor: const Color(0xFF240833),
          iconEnabledColor: const Color(0xFF9333EA),
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
          ),
        ),
      ),
    );
  }

  List<String> _getUniqueStates() {
    final states = _allMembers.map((m) => m.state).toSet().toList();
    states.sort();
    return states;
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.people_outline,
            size: 80,
            color: Colors.white.withOpacity(0.2),
          ),
          const SizedBox(height: 16),
          Text(
            'No Fan Club members found',
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 18,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMembersList() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      itemCount: _filteredMembers.length,
      itemBuilder: (context, index) {
        final member = _filteredMembers[index];
        return _buildMemberCard(member, index);
      },
    );
  }

  Widget _buildMemberCard(AdminFanClubModel member, int index) {
    final teamColor = AppConstants.teamColors[member.supportedTeam] ?? 0xFF9333EA;
    final teamLogo = AppConstants.teamLogos[member.supportedTeam] ?? '';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.05),
            Colors.white.withOpacity(0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Color(teamColor).withOpacity(0.3),
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _showMemberDetails(member),
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Team Logo
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.asset(
                      teamLogo,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Icon(
                          Icons.sports_kabaddi,
                          color: Color(teamColor),
                          size: 30,
                        );
                      },
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                // Member Info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        member.fullName,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        member.supportedTeam,
                        style: TextStyle(
                          color: Color(teamColor),
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(
                            Icons.location_on,
                            size: 14,
                            color: Colors.white.withOpacity(0.5),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '${member.city}, ${member.state}',
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.5),
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                // Arrow
                Icon(
                  Icons.chevron_right,
                  color: Colors.white.withOpacity(0.3),
                ),
              ],
            ),
          ),
        ),
      ),
    ).animate().fadeIn(duration: 200.ms, delay: (index * 30).ms);
  }
}

class _MemberDetailsDialog extends StatelessWidget {
  final AdminFanClubModel member;
  final VoidCallback onDelete;

  const _MemberDetailsDialog({
    required this.member,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final teamColor = AppConstants.teamColors[member.supportedTeam] ?? 0xFF9333EA;
    final teamLogo = AppConstants.teamLogos[member.supportedTeam] ?? '';

    return Dialog(
      backgroundColor: const Color(0xFF240833),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Member Details',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.white),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 20),
            
            // Team Logo and Name
            Center(
              child: Column(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Color(teamColor).withOpacity(0.5),
                        width: 2,
                      ),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.asset(
                        teamLogo,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Icon(
                            Icons.sports_kabaddi,
                            color: Color(teamColor),
                            size: 40,
                          );
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    member.supportedTeam,
                    style: TextStyle(
                      color: Color(teamColor),
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Member Info
            _buildDetailRow('Full Name', member.fullName),
            _buildDetailRow('Mobile Number', member.mobile),
            if (member.email.isNotEmpty) _buildDetailRow('Email', member.email),
            _buildDetailRow('State', member.state),
            _buildDetailRow('City', member.city),
            _buildDetailRow(
              'Registration Date',
              '${member.createdAt.day}/${member.createdAt.month}/${member.createdAt.year}',
            ),
            const SizedBox(height: 24),
            
            // Delete Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: onDelete,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Delete Member',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
