import 'package:flutter/material.dart';
import '../../domain/entities/match.dart';

class MatchCard extends StatelessWidget {
  final Match match;

  const MatchCard({super.key, required this.match});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 280,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF2D1B4E),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                _formatDate(match.scheduledAt),
                style: const TextStyle(
                  color: Colors.grey,
                  fontSize: 12,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: _getStatusColor(match.status),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  match.status,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Column(
                children: [
                  if (match.homeTeamLogo != null)
                    Image.network(
                      match.homeTeamLogo!,
                      height: 40,
                      errorBuilder: (context, error, stackTrace) {
                        return const Icon(Icons.sports_cricket, size: 40);
                      },
                    )
                  else
                    const Icon(Icons.sports_cricket, size: 40),
                  const SizedBox(height: 4),
                  Text(
                    match.homeTeamName ?? 'Home',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const Text(
                'VS',
                style: TextStyle(
                  color: Color(0xFFF4B400),
                  fontWeight: FontWeight.bold,
                ),
              ),
              Column(
                children: [
                  if (match.awayTeamLogo != null)
                    Image.network(
                      match.awayTeamLogo!,
                      height: 40,
                      errorBuilder: (context, error, stackTrace) {
                        return const Icon(Icons.sports_cricket, size: 40);
                      },
                    )
                  else
                    const Icon(Icons.sports_cricket, size: 40),
                  const SizedBox(height: 4),
                  Text(
                    match.awayTeamName ?? 'Away',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            match.venue,
            style: const TextStyle(
              color: Colors.grey,
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'LIVE':
        return Colors.red;
      case 'UPCOMING':
        return Colors.blue;
      case 'COMPLETED':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
}
