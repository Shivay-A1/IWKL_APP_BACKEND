import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/user.dart';

abstract class AuthRepository {
  Future<Either<Failure, User>> login(String phone, String password);
  Future<Either<Failure, User>> register(String phone, String password, String firstName, String? otp);
  Future<Either<Failure, void>> logout();
  Future<Either<Failure, User>> getCurrentUser();
  Future<Either<Failure, void>> forgotPassword(String phone);
  Future<Either<Failure, void>> resetPassword(String phone, String newPassword, String otp);
  Future<Either<Failure, void>> verifyOtp(String phone, String otp);
  Future<Either<Failure, void>> sendOtp(String phone);
}
