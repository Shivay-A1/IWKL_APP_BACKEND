import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:iwkl_app/core/constants/app_constants.dart';
import 'package:iwkl_app/core/widgets/glass_card.dart';
import 'package:iwkl_app/core/widgets/premium_app_bar.dart';
import 'package:iwkl_app/features/team/data/services/team_api_service.dart';
import 'package:iwkl_app/features/team/data/models/team_model.dart';
import 'package:iwkl_app/features/team/data/adapters/team_profile_adapter.dart';
import 'package:iwkl_app/features/team/presentation/screens/team_profile_screen.dart';

class TeamProfileScreenApi extends StatefulWidget {
  final String teamId;

  const TeamProfileScreenApi({
    super.key,
    required this.teamId,
  });

  @override
  State<TeamProfileScreenApi> createState() => _TeamProfileScreenApiState();
}

class _TeamProfileScreenApiState extends State<TeamProfileScreenApi> {
  final TeamApiService _teamApiService = TeamApiService();
  TeamProfileData? _teamData;
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchTeamData();
  }

  Future<void> _fetchTeamData() async {
    try {
      final teamJson = await _teamApiService.getTeamById(widget.teamId);
      final teamModel = TeamModel.fromJson(teamJson);
      final teamData = TeamProfileAdapter.fromTeamModel(teamModel);
      
      setState(() {
        _teamData = teamData;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: PremiumAppBar(
          showLogo: false,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: const Center(
          child: CircularProgressIndicator(color: Color(AppConstants.accentColorValue)),
        ),
      );
    }

    if (_error != null) {
      return Scaffold(
        appBar: PremiumAppBar(
          showLogo: false,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              Text(
                'Failed to load team data',
                style: const TextStyle(color: Colors.white, fontSize: 18),
              ),
              const SizedBox(height: 8),
              Text(
                _error!,
                style: const TextStyle(color: Colors.white54, fontSize: 14),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _fetchTeamData,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(AppConstants.accentColorValue),
                ),
                child: const Text('Retry', style: TextStyle(color: Colors.black)),
              ),
            ],
          ),
        ),
      );
    }

    return TeamProfileScreen(team: _teamData!);
  }
}
