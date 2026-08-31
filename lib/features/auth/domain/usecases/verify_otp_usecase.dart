import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/auth_repository.dart';

class VerifyOtpUseCase {
  final AuthRepository repository;

  VerifyOtpUseCase(this.repository);

  Future<Either<Failure, void>> call(VerifyOtpParams params) {
    return repository.verifyOtp(params.email, params.otp);
  }
}

class VerifyOtpParams {
  final String email;
  final String otp;

  VerifyOtpParams({
    required this.email,
    required this.otp,
  });
}
