import { initializeApp, getApps, getApp } from 'firebase/app'
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage'

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
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const storage = getStorage(app)

export async function uploadBase64(dataUrl: string, path: string): Promise<string> {
  try {
    console.log('[BACKEND] Uploading to Firebase Storage:', path)
    console.log('[BACKEND] Data URL length:', dataUrl.length)
    console.log('[BACKEND] Storage bucket:', firebaseConfig.storageBucket)
    
    const storageRef = ref(storage, path)
    console.log('[BACKEND] Storage ref created:', storageRef.fullPath)
    
    const uploadResult = await uploadString(storageRef, dataUrl, 'data_url')
    console.log('[BACKEND] Upload completed:', uploadResult)
    
    const downloadUrl = await getDownloadURL(storageRef)
    console.log('[BACKEND] Download URL obtained:', downloadUrl)
    
    return downloadUrl
  } catch (error: any) {
    console.error('[BACKEND] Firebase Storage upload error:', error)
    console.error('[BACKEND] Error code:', error.code)
    console.error('[BACKEND] Error message:', error.message)
    console.error('[BACKEND] Error details:', JSON.stringify(error, null, 2))
    throw new Error(`Failed to upload file to Firebase Storage: ${error.message}`)
  }
}
