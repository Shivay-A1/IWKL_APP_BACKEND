import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class RegisterUseCase {
  final AuthRepository repository;

  RegisterUseCase(this.repository);

  Future<Either<Failure, User>> call(RegisterParams params) {
    return repository.register(params.email, params.password, params.name, params.phone);
  }
}

class RegisterParams {
  final String email;
  final String password;
  final String name;
  final String? phone;

  RegisterParams({
    required this.email,
    required this.password,
    required this.name,
    this.phone,
  });
}
