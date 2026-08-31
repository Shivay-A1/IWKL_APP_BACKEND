import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/match.dart';
import '../../domain/entities/news.dart';
import '../../domain/entities/video.dart';
import '../../domain/entities/story.dart';
import '../../domain/usecases/load_home_data_usecase.dart';
import 'home_event.dart';
import 'home_state.dart';
import 'package:iwkl_app/core/network/socket_client.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final LoadHomeDataUseCase _loadHomeDataUseCase;
  final SocketClient _socketClient = SocketClient();
  bool _isSocketInitialized = false;

  HomeBloc(this._loadHomeDataUseCase) : super(HomeInitial()) {
    on<LoadHomeData>(_onLoadHomeData);
    _setupSocketListeners();
  }

  void _setupSocketListeners() {
    if (_isSocketInitialized) return;
    _isSocketInitialized = true;

    _socketClient.connect();

    // Listen for live score updates
    _socketClient.on('live-score-updated', (data) {
      print('Received live-score-updated: $data');
      if (state is HomeLoaded) {
        final currentState = state as HomeLoaded;
        final matchId = data['matchId'];

        // Update live match score
        if (currentState.liveMatch?.id == matchId) {
          final updatedLiveMatch = Match(
            id: currentState.liveMatch!.id,
            homeTeamId: currentState.liveMatch!.homeTeamId,
            awayTeamId: currentState.liveMatch!.awayTeamId,
            homeTeam: currentState.liveMatch!.homeTeam,
            awayTeam: currentState.liveMatch!.awayTeam,
            homeScore: data['homeScore'] ?? currentState.liveMatch!.homeScore,
            awayScore: data['awayScore'] ?? currentState.liveMatch!.awayScore,
            status: currentState.liveMatch!.status,
            matchDate: currentState.liveMatch!.matchDate,
            venue: currentState.liveMatch!.venue,
            matchType: currentState.liveMatch!.matchType,
            matchTimer: data['matchTimer'] ?? currentState.liveMatch!.matchTimer,
            halfTimeStatus: data['halfTimeStatus'] ?? currentState.liveMatch!.halfTimeStatus,
          );
          emit(currentState.copyWith(liveMatch: updatedLiveMatch));
        }

        // Update upcoming match score
        final updatedUpcoming = currentState.upcomingMatches.map((match) {
          if (match.id == matchId) {
            return Match(
              id: match.id,
              homeTeamId: match.homeTeamId,
              awayTeamId: match.awayTeamId,
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              homeScore: data['homeScore'] ?? match.homeScore,
              awayScore: data['awayScore'] ?? match.awayScore,
              status: match.status,
              matchDate: match.matchDate,
              venue: match.venue,
              matchType: match.matchType,
              matchTimer: data['matchTimer'] ?? match.matchTimer,
              halfTimeStatus: data['halfTimeStatus'] ?? match.halfTimeStatus,
            );
          }
          return match;
        }).toList();

        emit(currentState.copyWith(upcomingMatches: updatedUpcoming));
      }
    });

    // Listen for match status updates
    _socketClient.on('match-status-updated', (data) {
      print('Received match-status-updated: $data');
      if (state is HomeLoaded) {
        final currentState = state as HomeLoaded;
        final matchId = data['matchId'];
        final newStatus = data['status'];

        // Move match between lists based on status
        final liveMatch = currentState.liveMatch?.id == matchId && newStatus == 'LIVE'
            ? currentState.liveMatch
            : null;

        final upcomingMatches = currentState.upcomingMatches.where((match) {
          if (match.id == matchId) {
            return newStatus == 'SCHEDULED';
          }
          return true;
        }).toList();

        final completedMatches = currentState.completedMatches?.where((match) {
          if (match.id == matchId) {
            return newStatus == 'COMPLETED';
          }
          return true;
        }).toList() ?? [];

        emit(currentState.copyWith(
          liveMatch: liveMatch,
          upcomingMatches: upcomingMatches,
          completedMatches: completedMatches,
        ));
      }
    });

    // Listen for match updates
    _socketClient.on('match-updated', (data) {
      print('Received match-updated: $data');
      if (state is HomeLoaded) {
        add(LoadHomeData());
      }
    });

    // Listen for match deletion
    _socketClient.on('match-deleted', (data) {
      print('Received match-deleted: $data');
      if (state is HomeLoaded) {
        final currentState = state as HomeLoaded;
        final matchId = data['matchId'];

        final liveMatch = currentState.liveMatch?.id == matchId ? null : currentState.liveMatch;
        final upcomingMatches = currentState.upcomingMatches.where((match) => match.id != matchId).toList();
        final completedMatches = currentState.completedMatches?.where((match) => match.id != matchId).toList() ?? [];

        emit(currentState.copyWith(
          liveMatch: liveMatch,
          upcomingMatches: upcomingMatches,
          completedMatches: completedMatches,
        ));
      }
    });
  }

  Future<void> _onLoadHomeData(LoadHomeData event, Emitter<HomeState> emit) async {
    emit(HomeLoading());
    try {
      final result = await _loadHomeDataUseCase();
      result.fold(
        (failure) => emit(HomeLoaded(
          stories: [],
          sliders: [],
          liveMatch: null,
          upcomingMatches: [],
          news: [],
          videos: [],
          pointsTable: [],
          sponsors: [],
          unreadCount: 0,
        )),
        (data) => emit(HomeLoaded(
          stories: data['stories'] ?? [],
          sliders: data['sliders'] ?? [],
          liveMatch: data['liveMatch'] as Match?,
          upcomingMatches: data['upcomingMatches'] ?? [],
          news: data['news'] ?? [],
          videos: data['videos'] ?? [],
          pointsTable: data['pointsTable'] ?? [],
          sponsors: data['sponsors'] ?? [],
          unreadCount: data['unreadCount'] ?? 0,
        )),
      );
    } catch (e) {
      emit(HomeLoaded(
        stories: [],
        sliders: [],
        liveMatch: null,
        upcomingMatches: [],
        news: [],
        videos: [],
        pointsTable: [],
        sponsors: [],
        unreadCount: 0,
      ));
    }
  }
}
