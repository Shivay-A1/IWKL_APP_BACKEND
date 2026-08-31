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

  HomeBloc(this._loadHomeDataUseCase) : super(HomeInitial()) {
    on<LoadHomeData>(_onLoadHomeData);
    _setupSocketListeners();
  }

  void _setupSocketListeners() {
    print('Setting up socket listeners...');
    _socketClient.connect();

    // Listen for match creation
    _socketClient.on('match-created', (data) {
      print('Match created event received: $data');
      if (state is HomeLoaded) {
        final currentState = state as HomeLoaded;
        final newMatch = Match.fromJson(data);

        if (newMatch.status == 'LIVE') {
          // Add to live matches
          emit(currentState.copyWith(liveMatch: newMatch));
        } else if (newMatch.status == 'SCHEDULED') {
          // Add to upcoming matches
          final updatedMatches = [...currentState.upcomingMatches, newMatch];
          emit(currentState.copyWith(upcomingMatches: updatedMatches));
        }
      }
    });

    // Listen for match updates
    _socketClient.on('match-updated', (data) {
      if (state is HomeLoaded) {
        final currentState = state as HomeLoaded;
        final updatedMatch = Match.fromJson(data);
        
        if (updatedMatch.status == 'LIVE') {
          // Update live match
          emit(currentState.copyWith(liveMatch: updatedMatch));
        } else if (updatedMatch.status == 'SCHEDULED') {
          // Update in upcoming matches
          final updatedMatches = currentState.upcomingMatches.map((match) {
            return match.id == updatedMatch.id ? updatedMatch : match;
          }).toList();
          emit(currentState.copyWith(upcomingMatches: updatedMatches));
        }
      }
    });

    // Listen for live score updates
    _socketClient.on('live-score-updated', (data) {
      print('Live score updated event received: $data');
      if (state is HomeLoaded) {
        final currentState = state as HomeLoaded;
        final updatedMatch = Match.fromJson(data);

        if (currentState.liveMatch?.id == updatedMatch.id) {
          emit(currentState.copyWith(liveMatch: updatedMatch));
        }
      }
    });

    // Listen for match status updates
    _socketClient.on('match-status-updated', (data) {
      print('Match status updated event received: $data');
      if (state is HomeLoaded) {
        final currentState = state as HomeLoaded;
        final updatedMatch = Match.fromJson(data);

        if (updatedMatch.status == 'LIVE') {
          // Move from upcoming to live
          final updatedUpcoming = currentState.upcomingMatches
              .where((match) => match.id != updatedMatch.id)
              .toList();
          emit(currentState.copyWith(
            liveMatch: updatedMatch,
            upcomingMatches: updatedUpcoming,
          ));
        } else if (updatedMatch.status == 'COMPLETED') {
          // Remove from live
          emit(currentState.copyWith(liveMatch: null));
        }
      }
    });

    // Listen for match deletion
    _socketClient.on('match-deleted', (data) {
      print('Match deleted event received: $data');
      if (state is HomeLoaded) {
        final currentState = state as HomeLoaded;
        final matchId = data['id'] as String;

        if (currentState.liveMatch?.id == matchId) {
          emit(currentState.copyWith(liveMatch: null));
        }

        final updatedUpcoming = currentState.upcomingMatches
            .where((match) => match.id != matchId)
            .toList();
        emit(currentState.copyWith(upcomingMatches: updatedUpcoming));
      }
    });
  }

  @override
  Future<void> close() {
    _socketClient.disconnect();
    return super.close();
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
