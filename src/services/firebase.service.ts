import admin from 'firebase-admin';
import * as path from 'path';

// Initialize Firebase Admin
let firebaseApp: admin.app.App | null = null;

// Firebase Admin configuration
const firebaseConfig = {
  projectId: 'iwkl-app-ef7f8',
  clientEmail: 'firebase-adminsdk-fbsvc@iwkl-app-ef7f8.iam.gserviceaccount.com',
  privateKey: process.env.FIREBASE_PRIVATE_KEY || '',
};

export function initializeFirebaseAdmin() {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Check if service account file exists
    const serviceAccountPath = path.join(__dirname, '../iwkl-app-ef7f8-firebase-adminsdk-fbsvc-37b539fc96.json');
    
    // For Railway deployment, use environment variables
    if (process.env.FIREBASE_PRIVATE_KEY) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseConfig.projectId,
          clientEmail: firebaseConfig.clientEmail,
          privateKey: firebaseConfig.privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      // For local development, use service account file
      try {
        const serviceAccount = require(serviceAccountPath);
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } catch (fileError) {
        console.warn('⚠️ Firebase service account file not found, using environment variables');
        // Fallback to environment variable approach
        if (process.env.FIREBASE_PRIVATE_KEY) {
          firebaseApp = admin.initializeApp({
            credential: admin.credential.cert({
              projectId: firebaseConfig.projectId,
              clientEmail: firebaseConfig.clientEmail,
              privateKey: firebaseConfig.privateKey.replace(/\\n/g, '\n'),
            }),
          });
        }
      }
    }

    console.log('✅ Firebase Admin initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    throw error;
  }
}

export function getFirebaseAdmin() {
  if (!firebaseApp) {
    return initializeFirebaseAdmin();
  }
  return firebaseApp;
}

export function getFirestore() {
  const app = getFirebaseAdmin();
  return admin.firestore(app);
}

export function getAuth() {
  const app = getFirebaseAdmin();
  return admin.auth(app);
}

export function getMessaging() {
  const app = getFirebaseAdmin();
  return admin.messaging(app);
}

// Send push notification
export async function sendPushNotification({
  token,
  title,
  body,
  data,
}: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}) {
  try {
    const messaging = getMessaging();
    
    const message: admin.messaging.Message = {
      notification: {
        title,
        body,
      },
      token,
      data,
    };

    const response = await messaging.send(message);
    console.log('✅ Push notification sent successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to send push notification:', error);
    throw error;
  }
}

// Send multicast notification (multiple tokens)
export async function sendMulticastNotification({
  tokens,
  title,
  body,
  data,
}: {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
}) {
  try {
    const messaging = getMessaging();
    
    const message: admin.messaging.MulticastMessage = {
      notification: {
        title,
        body,
      },
      tokens,
      data,
    };

    const response = await messaging.sendMulticast(message);
    console.log('✅ Multicast notification sent:', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to send multicast notification:', error);
    throw error;
  }
}

// Subscribe user to topic
export async function subscribeToTopic({
  token,
  topic,
}: {
  token: string;
  topic: string;
}) {
  try {
    const messaging = getMessaging();
    const response = await messaging.subscribeToTopic(token, topic);
    console.log(`✅ Subscribed to topic ${topic}:`, response);
    return response;
  } catch (error) {
    console.error('❌ Failed to subscribe to topic:', error);
    throw error;
  }
}

// Firebase Authentication helpers
export async function verifyFirebaseToken(token: string) {
  try {
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('❌ Firebase token verification failed:', error);
    throw error;
  }
}

export async function createFirebaseUser({
  email,
  password,
  displayName,
}: {
  email: string;
  password: string;
  displayName?: string;
}) {
  try {
    const auth = getAuth();
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });
    console.log('✅ Firebase user created:', userRecord.uid);
    return userRecord;
  } catch (error) {
    console.error('❌ Failed to create Firebase user:', error);
    throw error;
  }
}

export async function setCustomClaims({
  uid,
  claims,
}: {
  uid: string;
  claims: Record<string, any>;
}) {
  try {
    const auth = getAuth();
    await auth.setCustomUserClaims(uid, claims);
    console.log('✅ Custom claims set for user:', uid);
  } catch (error) {
    console.error('❌ Failed to set custom claims:', error);
    throw error;
  }
}