import 'package:flutter/material.dart';
import '../../domain/entities/match.dart';

class LiveMatchCard extends StatelessWidget {
  final Match match;

  const LiveMatchCard({super.key, required this.match});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF4C085D), Color(0xFF2D1B4E)],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.red,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Row(
                  children: [
                    SizedBox(
                      width: 8,
                      height: 8,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    ),
                    SizedBox(width: 4),
                    Text(
                      'LIVE',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                match.venue,
                style: const TextStyle(color: Colors.white70, fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Column(
                children: [
                  if (match.homeTeamLogo != null)
                    Image.network(
                      match.homeTeamLogo!,
                      height: 50,
                      errorBuilder: (context, error, stackTrace) {
                        return const Icon(Icons.sports_cricket, size: 50);
                      },
                    )
                  else
                    const Icon(Icons.sports_cricket, size: 50),
                  const SizedBox(height: 8),
                  Text(
                    match.homeTeamName ?? 'Home Team',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              Column(
                children: [
                  Row(
                    children: [
                      Text(
                        match.homeScore.toString(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Text(
                        ' - ',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        match.awayScore.toString(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              Column(
                children: [
                  if (match.awayTeamLogo != null)
                    Image.network(
                      match.awayTeamLogo!,
                      height: 50,
                      errorBuilder: (context, error, stackTrace) {
                        return const Icon(Icons.sports_cricket, size: 50);
                      },
                    )
                  else
                    const Icon(Icons.sports_cricket, size: 50),
                  const SizedBox(height: 8),
                  Text(
                    match.awayTeamName ?? 'Away Team',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              Navigator.pushNamed(context, '/live-match');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF4B400),
              foregroundColor: Colors.black,
            ),
            child: const Text('Watch Live'),
          ),
        ],
      ),
    );
  }
}
