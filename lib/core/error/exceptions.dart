class FirebaseException implements Exception {
  final String code;
  final String message;

  FirebaseException({
    required this.code,
    required this.message,
  });

  @override
  String toString() => 'FirebaseException[$code]: $message';
}