import 'package:dio/dio.dart';
import 'package:iwkl_app/core/constants/app_constants.dart';

class TeamApiService {
  final Dio _dio = Dio();

  Future<Map<String, dynamic>> getTeamById(String teamId) async {
    try {
      final response = await _dio.get(
        '${AppConstants.baseUrl}/api/teams/$teamId',
      );

      // Handle both direct response and nested response formats
      final data = response.data;
      if (data is Map && data['data'] != null) {
        return data['data'] as Map<String, dynamic>;
      } else if (data is Map) {
        return data as Map<String, dynamic>;
      } else {
        throw Exception('Invalid response format');
      }
    } on DioException catch (e) {
      throw Exception('Failed to fetch team: ${e.message}');
    } catch (e) {
      throw Exception('Failed to fetch team: $e');
    }
  }

  Future<Map<String, dynamic>> getTeamStats(String teamId) async {
    try {
      final response = await _dio.get(
        '${AppConstants.baseUrl}/api/teams/$teamId/stats',
      );

      final data = response.data;
      if (data is Map && data['data'] != null) {
        return data['data'] as Map<String, dynamic>;
      } else if (data is Map) {
        return data as Map<String, dynamic>;
      } else {
        throw Exception('Invalid response format');
      }
    } on DioException catch (e) {
      throw Exception('Failed to fetch team stats: ${e.message}');
    } catch (e) {
      throw Exception('Failed to fetch team stats: $e');
    }
  }
}
