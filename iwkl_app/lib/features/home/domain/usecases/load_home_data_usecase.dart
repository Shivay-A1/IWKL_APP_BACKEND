import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/home_repository.dart';

class LoadHomeDataUseCase {
  final HomeRepository repository;

  LoadHomeDataUseCase(this.repository);

  Future<Either<Failure, Map<String, dynamic>>> call() {
    return repository.loadHomeData();
  }
}
