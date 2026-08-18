import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier, signInAnonymously } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBbBJDh1oOz4ulz_VVbCxOn9eL4AuOQrQ4",
  authDomain: "iwkl-website.firebaseapp.com",
  projectId: "iwkl-website",
  storageBucket: "iwkl-website.appspot.com",
  messagingSenderId: "134868565818",
  appId: "1:134868565818:web:25f23fb1a46c8989e31a03",
  measurementId: "G-J4XWEVJD5F"
}

// Initialize Firebase
console.log('[DEBUG] Initializing Firebase...')
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
console.log('[DEBUG] Firebase app initialized:', app.name)
const auth = getAuth(app)
console.log('[DEBUG] Firebase Auth initialized')
const db = getFirestore(app)
console.log('[DEBUG] Firestore initialized')
const storage = getStorage(app)
console.log('[DEBUG] Firebase Storage initialized')

export { app, auth, db, storage, signInAnonymously }
