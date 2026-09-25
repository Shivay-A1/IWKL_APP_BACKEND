import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/api_client.dart';

class NotificationRepositoryImpl {
  final ApiClient _apiClient;

  NotificationRepositoryImpl(this._apiClient);

  Future<Either<Failure, List<Map<String, dynamic>>>> getNotifications() async {
    try {
      final response = await _apiClient.get('/notifications');
      final notifications = response.data as List<dynamic>? ?? [];
      return Right(notifications.map((n) => n as Map<String, dynamic>).toList());
    } catch (e) {
      return Left(ServerFailure('Failed to load notifications: ${e.toString()}'));
    }
  }

  Future<Either<Failure, void>> markAsRead(String notificationId) async {
    try {
      await _apiClient.patch('/notifications/$notificationId/read');
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure('Failed to mark notification as read: ${e.toString()}'));
    }
  }

  Future<Either<Failure, void>> markAllAsRead() async {
    try {
      await _apiClient.patch('/notifications/read-all');
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure('Failed to mark all notifications as read: ${e.toString()}'));
    }
  }
}
