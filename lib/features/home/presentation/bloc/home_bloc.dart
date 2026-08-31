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

    // Listen for live score updates - reload data
    _socketClient.on('live-score-updated', (data) {
      print('Received live-score-updated: $data');
      add(LoadHomeData());
    });

    // Listen for match status updates - reload data
    _socketClient.on('match-status-updated', (data) {
      print('Received match-status-updated: $data');
      add(LoadHomeData());
    });

    // Listen for match updates - reload data
    _socketClient.on('match-updated', (data) {
      print('Received match-updated: $data');
      add(LoadHomeData());
    });

    // Listen for match deletion - reload data
    _socketClient.on('match-deleted', (data) {
      print('Received match-deleted: $data');
      add(LoadHomeData());
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
