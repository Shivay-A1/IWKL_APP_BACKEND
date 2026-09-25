import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/auth_repository.dart';

class ResetPasswordUseCase {
  final AuthRepository repository;

  ResetPasswordUseCase(this.repository);

  Future<Either<Failure, void>> call(ResetPasswordParams params) {
    return repository.resetPassword(params.phone, params.newPassword, params.otp);
  }
}

class ResetPasswordParams {
  final String phone;
  final String newPassword;
  final String otp;

  ResetPasswordParams({
    required this.phone,
    required this.newPassword,
    required this.otp,
  });
}
