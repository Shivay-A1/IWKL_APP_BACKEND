class FirebaseConfig {
  // Project Details
  static const String projectId = 'iwkl-app-ef7f8';
  static const String projectNumber = '204123845002';
  
  // Firebase Configuration - UPDATE THESE FROM FIREBASE CONSOLE
  static const String apiKey = 'YOUR_API_KEY_HERE';
  static const String authDomain = 'iwkl-app-ef7f8.firebaseapp.com';
  static const String databaseURL = 'https://iwkl-app-ef7f8-default-rtdb.firebaseio.com';
  static const String storageBucket = 'iwkl-app-ef7f8.appspot.com';
  static const String messagingSenderId = '204123845002';
  static const String appId = 'YOUR_APP_ID_HERE';
  static const String measurementId = 'YOUR_MEASUREMENT_ID_HERE';
  
  // Firebase Options for initialization
  static Map<String, dynamic> get firebaseOptions => {
    'apiKey': apiKey,
    'authDomain': authDomain,
    'projectId': projectId,
    'storageBucket': storageBucket,
    'messagingSenderId': messagingSenderId,
    'appId': appId,
    'measurementId': measurementId,
  };
  
  // Collection Names
  static const String usersCollection = 'users';
  static const String matchesCollection = 'matches';
  static const String teamsCollection = 'teams';
  static const String notificationsCollection = 'notifications';
  static const String fanClubCollection = 'fan_club';
}