import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class RegisterUseCase {
  final AuthRepository repository;

  RegisterUseCase(this.repository);

  Future<Either<Failure, User>> call(RegisterParams params) {
    return repository.register(params.phone, params.password, params.firstName, params.otp);
  }
}

class RegisterParams {
  final String phone;
  final String password;
  final String firstName;
  final String? otp;

  RegisterParams({
    required this.phone,
    required this.password,
    required this.firstName,
    this.otp,
  });
}
