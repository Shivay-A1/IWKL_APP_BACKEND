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
      // Fetch matches from Railway backend
      final matchesResponse = await _apiClient.get(ApiEndpoints.matches);
      List<dynamic> matchesDataList = [];
      if (matchesResponse.data is Map && matchesResponse.data['data'] is List) {
        matchesDataList = matchesResponse.data['data'] as List<dynamic>;
      } else if (matchesResponse.data is List) {
        matchesDataList = matchesResponse.data as List<dynamic>;
      }
      final matchesData = matchesDataList;

      // Fetch stories from Railway backend
      final storiesResponse = await _apiClient.get(ApiEndpoints.stories);
      List<dynamic> storiesDataList = [];
      if (storiesResponse.data is Map && storiesResponse.data['data'] is List) {
        storiesDataList = storiesResponse.data['data'] as List<dynamic>;
      } else if (storiesResponse.data is List) {
        storiesDataList = storiesResponse.data as List<dynamic>;
      }
      final stories = storiesDataList
          .map((s) => Story.fromJson(s as Map<String, dynamic>))
          .toList();

      // Fetch banners from Railway backend
      final bannersResponse = await _apiClient.get('/homepage-banners');
      List<dynamic> bannersDataList = [];
      if (bannersResponse.data is Map && bannersResponse.data['data'] is List) {
        bannersDataList = bannersResponse.data['data'] as List<dynamic>;
      } else if (bannersResponse.data is List) {
        bannersDataList = bannersResponse.data as List<dynamic>;
      }
      final bannersData = bannersDataList;

      // Fetch gallery from Railway backend
      final galleryResponse = await _apiClient.get('/gallery?limit=1000');
      List<dynamic> galleryDataList = [];
      if (galleryResponse.data is Map && galleryResponse.data['data'] is List) {
        galleryDataList = galleryResponse.data['data'] as List<dynamic>;
      } else if (galleryResponse.data is List) {
        galleryDataList = galleryResponse.data as List<dynamic>;
      }
      final galleryData = galleryDataList;

      // Fetch news from Railway backend
      final newsResponse = await _apiClient.get('/news?limit=100');
      List<dynamic> newsDataList = [];
      if (newsResponse.data is Map && newsResponse.data['data'] is List) {
        newsDataList = newsResponse.data['data'] as List<dynamic>;
      } else if (newsResponse.data is List) {
        newsDataList = newsResponse.data as List<dynamic>;
      }
      final news = newsDataList
          .map((n) => News.fromJson(n as Map<String, dynamic>))
          .toList();

      // Fetch videos from Railway backend
      final videosResponse = await _apiClient.get('/videos');
      List<dynamic> videosDataList = [];
      if (videosResponse.data is Map && videosResponse.data['data'] is List) {
        videosDataList = videosResponse.data['data'] as List<dynamic>;
      } else if (videosResponse.data is List) {
        videosDataList = videosResponse.data as List<dynamic>;
      }
      final videos = videosDataList
          .map((v) => Video.fromJson(v as Map<String, dynamic>))
          .toList();
      
      // Extract image URLs from banners for slider
      final sliderImages = bannersData
          .map((b) => b['imageUrl'] as String? ?? b['image'] as String? ?? '')
          .where((url) => url.isNotEmpty)
          .toList();
      
      // Separate live and upcoming matches
      final liveMatches = matchesData.where((m) => m['status'] == 'LIVE').toList();
      final upcomingMatches = matchesData.where((m) => m['status'] == 'SCHEDULED').toList();
      
      // Convert to Match entities
      final liveMatch = liveMatches.isNotEmpty 
          ? Match.fromJson(liveMatches.first as Map<String, dynamic>) 
          : null;
      final upcomingMatchEntities = upcomingMatches
          .map((m) => Match.fromJson(m as Map<String, dynamic>))
          .toList();
      
      return Right({
        'stories': stories,
        'sliders': sliderImages,
        'banners': bannersData,
        'liveMatch': liveMatch,
        'upcomingMatches': upcomingMatchEntities,
        'news': news,
        'videos': videos,
        'pointsTable': <Map<String, dynamic>>[],
        'sponsors': <String>[],
        'gallery': galleryData,
        'unreadCount': 0,
      });
    } catch (e) {
      return Left(ServerFailure('Failed to load home data: ${e.toString()}'));
    }
  }
}
