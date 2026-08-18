import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/match.dart';
import '../../domain/entities/news.dart';
import '../../domain/entities/video.dart';
import '../../domain/entities/story.dart';
import '../../domain/usecases/load_home_data_usecase.dart';
import 'home_event.dart';
import 'home_state.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final LoadHomeDataUseCase _loadHomeDataUseCase;

  HomeBloc(this._loadHomeDataUseCase) : super(HomeInitial()) {
    on<LoadHomeData>(_onLoadHomeData);
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
