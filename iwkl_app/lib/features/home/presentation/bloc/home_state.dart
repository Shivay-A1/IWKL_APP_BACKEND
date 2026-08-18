import '../../domain/entities/match.dart';
import '../../domain/entities/news.dart';
import '../../domain/entities/video.dart';
import '../../domain/entities/story.dart';

abstract class HomeState {}

class HomeInitial extends HomeState {}

class HomeLoading extends HomeState {}

class HomeLoaded extends HomeState {
  final List<Story> stories;
  final List<String> sliders;
  final Match? liveMatch;
  final List<Match> upcomingMatches;
  final List<News> news;
  final List<Video> videos;
  final List<dynamic> pointsTable;
  final List<String> sponsors;
  final List<dynamic> teams;
  final List<dynamic> players;
  final List<dynamic> gallery;
  final int unreadCount;

  HomeLoaded({
    required this.stories,
    required this.sliders,
    this.liveMatch,
    required this.upcomingMatches,
    required this.news,
    required this.videos,
    required this.pointsTable,
    required this.sponsors,
    this.teams = const [],
    this.players = const [],
    this.gallery = const [],
    required this.unreadCount,
  });
}

class HomeError extends HomeState {
  final String message;

  HomeError(this.message);
}
