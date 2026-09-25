import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../../../core/error/failures.dart';

class NotificationRepositoryImpl {
  final Dio _dio;

  NotificationRepositoryImpl(this._dio);

  Future<Either<Failure, List<Map<String, dynamic>>>> getNotifications() async {
    try {
      // Use public endpoint for testing (no auth required)
      final response = await _dio.get('https://iwklappbackend-production.up.railway.app/api/notifications/public');
      // Handle both array response and paginated response
      final data = response.data;
      List<dynamic> notifications = [];
      
      if (data is List) {
        notifications = data;
      } else if (data is Map && data['data'] is List) {
        notifications = data['data'] as List<dynamic>;
      } else if (data is Map && data['notifications'] is List) {
        notifications = data['notifications'] as List<dynamic>;
      }
      
      return Right(notifications.map((n) => n as Map<String, dynamic>).toList());
    } catch (e) {
      print('Error fetching notifications: $e');
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
