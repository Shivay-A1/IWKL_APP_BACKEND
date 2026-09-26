import 'package:dartz/dartz.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/constants/app_constants.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final ApiClient _apiClient;
  final SharedPreferences _preferences;

  AuthRepositoryImpl(this._apiClient, this._preferences);

  @override
  Future<Either<Failure, User>> login(String phone, String password) async {
    try {
      final response = await _apiClient.post('/auth/signin', data: {
        'phone': phone,
        'password': password,
      });

      if (response.statusCode == 200) {
        final user = User.fromJson(response.data['user']);
        await _preferences.setString(
          AppConstants.accessTokenKey,
          response.data['token'],
        );
        await _preferences.setString(
          AppConstants.userDataKey,
          response.data['user'].toString(),
        );
        return Right(user);
      } else {
        return Left(AuthFailure(response.data['error'] ?? 'Login failed'));
      }
    } on DioException catch (e) {
      if (e.response != null && e.response!.data != null) {
        // Extract error message from backend response
        final errorMessage = e.response!.data['error'] ?? 'Login failed';
        return Left(AuthFailure(errorMessage));
      }
      return Left(AuthFailure('Network error. Please check your connection.'));
    } catch (e) {
      return Left(AuthFailure('Login failed: ${e.toString()}'));
    }
  }

  @override
  Future<Either<Failure, User>> register(String phone, String password, String firstName, String? otp) async {
    try {
      final response = await _apiClient.post('/auth/signup', data: {
        'phone': phone,
        'firstName': firstName,
        'password': password,
      });

      if (response.statusCode == 200) {
        final user = User.fromJson(response.data['user']);
        await _preferences.setString(
          AppConstants.accessTokenKey,
          response.data['token'],
        );
        await _preferences.setString(
          AppConstants.userDataKey,
          response.data['user'].toString(),
        );
        return Right(user);
      } else {
        return Left(AuthFailure(response.data['error'] ?? 'Registration failed'));
      }
    } on DioException catch (e) {
      if (e.response != null && e.response!.data != null) {
        // Extract error message from backend response
        final errorMessage = e.response!.data['error'] ?? 'Registration failed';
        return Left(AuthFailure(errorMessage));
      }
      return Left(AuthFailure('Network error. Please check your connection.'));
    } catch (e) {
      return Left(AuthFailure('Registration failed: ${e.toString()}'));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      await _preferences.remove(AppConstants.accessTokenKey);
      await _preferences.remove(AppConstants.userDataKey);
      return const Right(null);
    } catch (e) {
      await _preferences.remove(AppConstants.accessTokenKey);
      await _preferences.remove(AppConstants.userDataKey);
      return const Right(null);
    }
  }

  @override
  Future<Either<Failure, User>> getCurrentUser() async {
    try {
      final userData = _preferences.getString(AppConstants.userDataKey);
      if (userData != null) {
        return Right(User.fromJson(userData as Map<String, dynamic>));
      }
      return Left(AuthFailure('No user logged in'));
    } catch (e) {
      return Left(AuthFailure('Failed to get current user'));
    }
  }

  @override
  Future<Either<Failure, void>> forgotPassword(String phone) async {
    try {
      final response = await _apiClient.post('/auth/forgot-password', data: {'phone': phone});
      if (response.statusCode == 200) {
        return const Right(null);
      }
      return Left(AuthFailure(response.data['error'] ?? 'Failed to send OTP'));
    } catch (e) {
      return Left(AuthFailure('Failed to send OTP: ${e.toString()}'));
    }
  }

  @override
  Future<Either<Failure, void>> resetPassword(String phone, String newPassword, String otp) async {
    try {
      final response = await _apiClient.post('/auth/reset-password', data: {
        'phone': phone,
        'newPassword': newPassword,
        'otp': otp,
      });
      if (response.statusCode == 200) {
        return const Right(null);
      }
      return Left(AuthFailure(response.data['error'] ?? 'Failed to reset password'));
    } catch (e) {
      return Left(AuthFailure('Failed to reset password: ${e.toString()}'));
    }
  }

  @override
  Future<Either<Failure, void>> verifyOtp(String phone, String otp) async {
    try {
      final response = await _apiClient.post('/auth/verify-otp', data: {
        'phone': phone,
        'otp': otp,
      });
      if (response.statusCode == 200) {
        return const Right(null);
      }
      return Left(AuthFailure(response.data['error'] ?? 'Failed to verify OTP'));
    } catch (e) {
      return Left(AuthFailure('Failed to verify OTP: ${e.toString()}'));
    }
  }

  @override
  Future<Either<Failure, void>> sendOtp(String phone) async {
    try {
      final response = await _apiClient.post('/auth/send-otp', data: {'phone': phone});
      if (response.statusCode == 200) {
        return const Right(null);
      }
      return Left(AuthFailure(response.data['error'] ?? 'Failed to send OTP'));
    } catch (e) {
      return Left(AuthFailure('Failed to send OTP: ${e.toString()}'));
    }
  }
}
