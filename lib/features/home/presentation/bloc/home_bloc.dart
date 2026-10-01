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

    try {
      _socketClient.connect();

      // Listen for live score updates - reload data
      _socketClient.on('live-score-updated', (data) {
        print('Received live-score-updated: $data');
        try {
          add(LoadHomeData());
        } catch (e) {
          print('Error handling live-score-updated: $e');
        }
      });

      // Listen for match status updates - reload data
      _socketClient.on('match-status-updated', (data) {
        print('Received match-status-updated: $data');
        try {
          add(LoadHomeData());
        } catch (e) {
          print('Error handling match-status-updated: $e');
        }
      });

      // Listen for match updates - reload data
      _socketClient.on('match-updated', (data) {
        print('Received match-updated: $data');
        try {
          add(LoadHomeData());
        } catch (e) {
          print('Error handling match-updated: $e');
        }
      });

      // Listen for match deletion - reload data
      _socketClient.on('match-deleted', (data) {
        print('Received match-deleted: $data');
        try {
          add(LoadHomeData());
        } catch (e) {
          print('Error handling match-deleted: $e');
        }
      });
    } catch (e) {
      print('Error setting up socket listeners: $e');
    }
  }

  Future<void> _onLoadHomeData(LoadHomeData event, Emitter<HomeState> emit) async {
    emit(HomeLoading());
    try {
      final result = await _loadHomeDataUseCase();
      result.fold(
        (failure) => emit(HomeLoaded(
          stories: [],
          sliders: [],
          banners: [],
          liveMatch: null,
          upcomingMatches: [],
          news: [],
          videos: [],
          pointsTable: [],
          sponsors: [],
          gallery: [],
          unreadCount: 0,
        )),
        (data) => emit(HomeLoaded(
          stories: data['stories'] ?? [],
          sliders: data['sliders'] ?? [],
          banners: data['banners'] ?? [],
          liveMatch: data['liveMatch'] as Match?,
          upcomingMatches: data['upcomingMatches'] ?? [],
          news: (data['news'] as List<dynamic>?)?.cast<News>() ?? [],
          videos: data['videos'] ?? [],
          pointsTable: data['pointsTable'] ?? [],
          sponsors: data['sponsors'] ?? [],
          gallery: data['gallery'] ?? [],
          unreadCount: data['unreadCount'] ?? 0,
        )),
      );
    } catch (e) {
      emit(HomeLoaded(
        stories: [],
        sliders: [],
        banners: [],
        liveMatch: null,
        upcomingMatches: [],
        news: [],
        videos: [],
        pointsTable: [],
        sponsors: [],
        gallery: [],
        unreadCount: 0,
      ));
    }
  }
}
