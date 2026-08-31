import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/auth_repository.dart';

class ResetPasswordUseCase {
  final AuthRepository repository;

  ResetPasswordUseCase(this.repository);

  Future<Either<Failure, void>> call(ResetPasswordParams params) {
    return repository.resetPassword(params.email, params.password, params.otp);
  }
}

class ResetPasswordParams {
  final String email;
  final String password;
  final String otp;

  ResetPasswordParams({
    required this.email,
    required this.password,
    required this.otp,
  });
}
