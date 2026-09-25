import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../../../core/error/failures.dart';

class NotificationRepositoryImpl {
  final Dio _dio;

  NotificationRepositoryImpl(this._dio);

  Future<Either<Failure, List<Map<String, dynamic>>>> getNotifications() async {
    try {
      final response = await _dio.get('https://iwklappbackend-production.up.railway.app/api/notifications');
      final notifications = response.data as List<dynamic>? ?? [];
      return Right(notifications.map((n) => n as Map<String, dynamic>).toList());
    } catch (e) {
      return Left(ServerFailure('Failed to load notifications: ${e.toString()}'));
    }
  }

  Future<Either<Failure, void>> markAsRead(String notificationId) async {
    try {
      await _dio.patch('https://iwklappbackend-production.up.railway.app/api/notifications/$notificationId/read');
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure('Failed to mark notification as read: ${e.toString()}'));
    }
  }

  Future<Either<Failure, void>> markAllAsRead() async {
    try {
      await _dio.patch('https://iwklappbackend-production.up.railway.app/api/notifications/read-all');
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure('Failed to mark all notifications as read: ${e.toString()}'));
    }
  }
}
