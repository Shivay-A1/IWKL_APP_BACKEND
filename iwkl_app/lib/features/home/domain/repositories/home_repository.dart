import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/match.dart';
import '../entities/news.dart';
import '../entities/video.dart';
import '../entities/story.dart';

abstract class HomeRepository {
  Future<Either<Failure, Map<String, dynamic>>> loadHomeData();
}
