import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/auth_repository.dart';

class VerifyOtpUseCase {
  final AuthRepository repository;

  VerifyOtpUseCase(this.repository);

  Future<Either<Failure, void>> call(VerifyOtpParams params) {
    return repository.verifyOtp(params.phone, params.otp);
  }
}

class VerifyOtpParams {
  final String phone;
  final String otp;

  VerifyOtpParams({
    required this.phone,
    required this.otp,
  });
}
