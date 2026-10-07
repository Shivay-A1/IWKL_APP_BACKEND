import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:dio/dio.dart';
import 'package:iwkl_app/core/constants/app_constants.dart';

class TeamsScreen extends StatefulWidget {
  const TeamsScreen({super.key});

  @override
  State<TeamsScreen> createState() => _TeamsScreenState();
}

class _TeamsScreenState extends State<TeamsScreen> {
  List<dynamic> _teams = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchTeams();
  }

  Future<void> _fetchTeams() async {
    try {
      final dio = Dio();
      final response = await dio.get('${AppConstants.baseUrl}/teams');

      if (response.statusCode == 200) {
        final data = response.data;
        // Handle different response structures
        if (data is Map && data['data'] is List) {
          setState(() {
            _teams = data['data'];
            _isLoading = false;
          });
        } else if (data is List) {
          setState(() {
            _teams = data;
            _isLoading = false;
          });
        }
      }
    } catch (e) {
      setState(() {
        _error = 'Failed to load teams';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: const Text(
          'Teams',
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
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: _fetchTeams,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFF9333EA)),
            )
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _error!,
                        style: const TextStyle(color: Colors.white),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _fetchTeams,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF9333EA),
                        ),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : _teams.isEmpty
                  ? const Center(
                      child: Text(
                        'No teams available',
                        style: TextStyle(color: Colors.white),
                      ),
                    )
                  : GridView.builder(
                      padding: const EdgeInsets.all(16),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.8,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                      ),
                      itemCount: _teams.length,
                      itemBuilder: (context, index) {
                        final team = _teams[index];
                        return _buildTeamCard(team, index);
                      },
                    ),
    );
  }

  Widget _buildTeamCard(dynamic team, int index) {
    final teamName = team['name'] ?? 'Unknown Team';
    final teamLogo = team['logo'] ?? team['logoUrl'] ?? '';
    final teamShortName = team['shortName'] ?? '';
    final teamCity = team['city'] ?? '';
    final isActive = team['isActive'] ?? true;

    // Handle logo URL - if it's a relative path, prepend backend URL
    String logoUrl = teamLogo;
    if (logoUrl.isNotEmpty && !logoUrl.startsWith('http')) {
      logoUrl = '${AppConstants.baseUrl}$logoUrl';
    }

    final colors = [
      const Color(0xFF9333EA),
      const Color(0xFFEC4899),
      const Color(0xFF4C085D),
      const Color(0xFF10B981),
      const Color(0xFFF59E0B),
    ];
    final teamColor = colors[index % colors.length];

    return GestureDetector(
      onTap: () {
        // Navigate to team detail - for now show alert
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            backgroundColor: const Color(0xFF13051E),
            title: Text(
              teamName,
              style: const TextStyle(color: Colors.white),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (teamShortName.isNotEmpty)
                  Text('Short Name: $teamShortName', style: const TextStyle(color: Colors.white70)),
                if (teamCity.isNotEmpty)
                  Text('City: $teamCity', style: const TextStyle(color: Colors.white70)),
                const SizedBox(height: 8),
                Text('Status: ${isActive ? "Active" : "Inactive"}', style: const TextStyle(color: Colors.white70)),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Close', style: TextStyle(color: Color(0xFF9333EA))),
              ),
            ],
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.white.withOpacity(0.05),
              Colors.white.withOpacity(0.02),
            ],
          ),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: teamColor.withOpacity(0.3),
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [
                    teamColor.withOpacity(0.3),
                    teamColor.withOpacity(0.1),
                  ],
                ),
              ),
              child: logoUrl.isNotEmpty
                  ? ClipOval(
                      child: Image.network(
                        logoUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return const Icon(
                            Icons.sports_kabaddi,
                            size: 40,
                            color: Colors.white,
                          );
                        },
                      ),
                    )
                  : const Icon(
                      Icons.sports_kabaddi,
                      size: 40,
                      color: Colors.white,
                    ),
            ),
            const SizedBox(height: 12),
            Text(
              teamName,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(
              teamShortName.isNotEmpty ? teamShortName : teamCity,
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ).animate().fadeIn(duration: 300.ms, delay: (index * 100).ms).scale(begin: const Offset(0.9, 0.9)),
    );
  }
}
