import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/constants/api_endpoints.dart';
import '../../domain/entities/match.dart';
import '../../domain/entities/news.dart';
import '../../domain/entities/video.dart';
import '../../domain/entities/story.dart';
import '../../domain/repositories/home_repository.dart';

class HomeRepositoryImpl implements HomeRepository {
  final ApiClient _apiClient;

  HomeRepositoryImpl(this._apiClient);

  @override
  Future<Either<Failure, Map<String, dynamic>>> loadHomeData() async {
    try {
      // Return fallback data with user-provided YouTube Shorts links
      return Right({
        'stories': <Story>[],
        'sliders': <String>[],
        'liveMatch': null,
        'upcomingMatches': <Match>[],
        'news': <News>[],
        'videos': [
          Video(
            id: '1',
            title: 'IWKL Kabaddi Highlight 1',
            thumbnail: 'https://img.youtube.com/vi/E8YS-cPPdZY/hqdefault.jpg',
            videoUrl: 'https://youtube.com/shorts/E8YS-cPPdZY?si=JgGJfcXqrXCRqWK9',
            category: 'Highlights',
            duration: 30, // 30 seconds
            isPremium: false,
            viewCount: 0,
          ),
          Video(
            id: '2',
            title: 'IWKL Kabaddi Highlight 2',
            thumbnail: 'https://img.youtube.com/vi/YZjFff0rfqE/hqdefault.jpg',
            videoUrl: 'https://youtube.com/shorts/YZjFff0rfqE?si=9YAFEtAKNtyH_IQP',
            category: 'Highlights',
            duration: 30, // 30 seconds
            isPremium: false,
            viewCount: 0,
          ),
          Video(
            id: '3',
            title: 'IWKL Kabaddi Highlight 3',
            thumbnail: 'https://img.youtube.com/vi/KMIeFlYcPg0/hqdefault.jpg',
            videoUrl: 'https://youtube.com/shorts/KMIeFlYcPg0?si=n45a687cXbkcnQb6',
            category: 'Highlights',
            duration: 30, // 30 seconds
            isPremium: false,
            viewCount: 0,
          ),
        ],
        'pointsTable': <Map<String, dynamic>>[],
        'sponsors': <String>[],
        'unreadCount': 0,
      });
    } catch (e) {
      return Left(ServerFailure('Failed to load home data: ${e.toString()}'));
    }
  }
}
