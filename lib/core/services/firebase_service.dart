import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import '../constants/firebase_config.dart';
import '../error/exceptions.dart' as custom_exceptions;

class FirebaseService {
  static final FirebaseService _instance = FirebaseService._internal();
  factory FirebaseService() => _instance;
  FirebaseService._internal();

  bool _initialized = false;
  FirebaseApp? _app;
  FirebaseAuth? _auth;
  FirebaseFirestore? _firestore;
  FirebaseMessaging? _messaging;

  bool get isInitialized => _initialized;
  FirebaseApp? get app => _app;
  FirebaseAuth? get auth => _auth;
  FirebaseFirestore? get firestore => _firestore;
  FirebaseMessaging? get messaging => _messaging;

  /// Initialize Firebase
  Future<void> initialize() async {
    if (_initialized) return;

    try {
      // Firebase initialization disabled for now - config incomplete
      print('⚠️ Firebase initialization skipped - config incomplete');
      _initialized = true;
      return;
      
      // Initialize Firebase with options
      _app = await Firebase.initializeApp(
        options: FirebaseOptions(
          apiKey: FirebaseConfig.apiKey,
          authDomain: FirebaseConfig.authDomain,
          projectId: FirebaseConfig.projectId,
          storageBucket: FirebaseConfig.storageBucket,
          messagingSenderId: FirebaseConfig.messagingSenderId,
          appId: FirebaseConfig.appId,
          measurementId: FirebaseConfig.measurementId,
        ),
      );

      // Initialize services
      _auth = FirebaseAuth.instanceFor(app: _app!);
      _firestore = FirebaseFirestore.instanceFor(app: _app!);
      _messaging = FirebaseMessaging.instance;

      // Request notification permissions
      await _setupNotifications();

      _initialized = true;
      print('✅ Firebase initialized successfully');
    } catch (e) {
      print('❌ Firebase initialization failed: $e');
      throw custom_exceptions.FirebaseException(
        code: 'INIT_FAILED',
        message: 'Failed to initialize Firebase: $e',
      );
    }
  }

  /// Setup push notifications
  Future<void> _setupNotifications() async {
    if (_messaging == null) return;

    try {
      // Request permission
      NotificationSettings settings = await _messaging!.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );

      print('Notification permission granted: ${settings.authorizationStatus}');

      // Get FCM token
      String? token = await _messaging!.getToken();
      print('FCM Token: $token');

      // Listen to token refresh
      _messaging!.onTokenRefresh.listen((newToken) {
        print('FCM Token refreshed: $newToken');
        // TODO: Send new token to backend
      });
    } catch (e) {
      print('❌ Notification setup failed: $e');
    }
  }

  /// Get current user
  User? get currentUser => _auth?.currentUser;

  /// Sign in with email and password
  Future<User?> signInWithEmailAndPassword({
    required String email,
    required String password,
  }) async {
    if (_auth == null) {
      throw FirebaseAuthException(
        code: 'NOT_INITIALIZED',
        message: 'Firebase Auth not initialized',
      );
    }

    try {
      final userCredential = await _auth!.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      return userCredential.user;
    } catch (e) {
      print('❌ Sign in failed: $e');
      rethrow;
    }
  }

  /// Sign up with email and password
  Future<User?> signUpWithEmailAndPassword({
    required String email,
    required String password,
  }) async {
    if (_auth == null) {
      throw FirebaseAuthException(
        code: 'NOT_INITIALIZED',
        message: 'Firebase Auth not initialized',
      );
    }

    try {
      final userCredential = await _auth!.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      return userCredential.user;
    } catch (e) {
      print('❌ Sign up failed: $e');
      rethrow;
    }
  }

  /// Sign out
  Future<void> signOut() async {
    if (_auth == null) return;
    await _auth!.signOut();
  }

  /// Save user data to Firestore
  Future<void> saveUserData({
    required String userId,
    required Map<String, dynamic> userData,
  }) async {
    if (_firestore == null) {
      throw FirebaseAuthException(
        code: 'NOT_INITIALIZED',
        message: 'Firestore not initialized',
      );
    }

    try {
      await _firestore!
          .collection(FirebaseConfig.usersCollection)
          .doc(userId)
          .set(userData, SetOptions(merge: true));
      print('✅ User data saved successfully');
    } catch (e) {
      print('❌ Failed to save user data: $e');
      rethrow;
    }
  }

  /// Get user data from Firestore
  Future<Map<String, dynamic>?> getUserData(String userId) async {
    if (_firestore == null) {
      throw FirebaseAuthException(
        code: 'NOT_INITIALIZED',
        message: 'Firestore not initialized',
      );
    }

    try {
      final docSnapshot = await _firestore!
          .collection(FirebaseConfig.usersCollection)
          .doc(userId)
          .get();

      if (docSnapshot.exists) {
        return docSnapshot.data() as Map<String, dynamic>;
      }
      return null;
    } catch (e) {
      print('❌ Failed to get user data: $e');
      return null;
    }
  }

  /// Send push notification (via Cloud Functions or backend)
  Future<void> sendPushNotification({
    required String token,
    required String title,
    required String body,
    Map<String, dynamic>? data,
  }) async {
    // This should be handled by backend or Cloud Functions
    // For now, just log the request
    print('📱 Push notification request: $title - $body to token: $token');
    // TODO: Implement backend integration for FCM
  }
}