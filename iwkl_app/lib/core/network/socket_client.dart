import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../constants/app_constants.dart';

class SocketClient {
  late IO.Socket _socket;
  static final SocketClient _instance = SocketClient._internal();

  factory SocketClient() {
    return _instance;
  }

  SocketClient._internal();

  void connect() {
    _socket = IO.io(
      AppConstants.socketUrl,
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .enableAutoConnect()
          .build(),
    );

    _socket.onConnect((_) {
      print('Socket connected');
    });

    _socket.onDisconnect((_) {
      print('Socket disconnected');
    });

    _socket.onError((error) {
      print('Socket error: $error');
    });
  }

  void disconnect() {
    _socket.disconnect();
  }

  void emit(String event, dynamic data) {
    _socket.emit(event, data);
  }

  void on(String event, Function callback) {
    _socket.on(event, (data) => callback(data));
  }

  void off(String event) {
    _socket.off(event);
  }

  IO.Socket get socket => _socket;
}
