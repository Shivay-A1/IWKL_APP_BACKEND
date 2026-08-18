import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_constants.dart';
import '../constants/api_endpoints.dart';

class ApiClient {
  late Dio _dio;
  final SharedPreferences _preferences;

  ApiClient(this._preferences) {
    _dio = Dio(BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: AppConstants.connectionTimeout,
      receiveTimeout: AppConstants.receiveTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = _preferences.getString(AppConstants.accessTokenKey);
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          await _refreshToken();
          final token = _preferences.getString(AppConstants.accessTokenKey);
          if (token != null) {
            error.requestOptions.headers['Authorization'] = 'Bearer $token';
            return handler.resolve(await _dio.fetch(error.requestOptions));
          }
        }
        return handler.next(error);
      },
    ));
  }

  Future<void> _refreshToken() async {
    try {
      final refreshToken = _preferences.getString(AppConstants.refreshTokenKey);
      if (refreshToken != null) {
        final response = await _dio.post(
          ApiEndpoints.refreshToken,
          data: {'refreshToken': refreshToken},
        );
        if (response.statusCode == 200) {
          await _preferences.setString(
            AppConstants.accessTokenKey,
            response.data['accessToken'],
          );
          await _preferences.setString(
            AppConstants.refreshTokenKey,
            response.data['refreshToken'],
          );
        }
      }
    } catch (e) {
      await _preferences.remove(AppConstants.accessTokenKey);
      await _preferences.remove(AppConstants.refreshTokenKey);
    }
  }

  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) {
    return _dio.get(path, queryParameters: queryParameters);
  }

  Future<Response> post(String path, {dynamic data}) {
    return _dio.post(path, data: data);
  }

  Future<Response> put(String path, {dynamic data}) {
    return _dio.put(path, data: data);
  }

  Future<Response> delete(String path) {
    return _dio.delete(path);
  }

  Future<Response> patch(String path, {dynamic data}) {
    return _dio.patch(path, data: data);
  }

  Future<Response> upload(String path, FormData data) {
    return _dio.post(path, data: data);
  }
}
