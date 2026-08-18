// ============================================================================
// ⚠️  REGISTRATION FLOW - DO NOT MODIFY WITHOUT APPROVAL ⚠️
// ============================================================================
// This file contains the critical registration flow that is currently working.
// Any changes to this file may break the registration system.
//
// BEFORE MAKING CHANGES:
// 1. Read REGISTRATION_FLOW_LOCK.md in project root
// 2. Test thoroughly in development environment
// 3. Get approval from project owner
// 4. Document changes in REGISTRATION_FLOW_LOCK.md
//
// LAST UPDATED: 2026-08-04
// STATUS: ✅ WORKING - LOCKED
// ============================================================================

import { db, storage } from './firebase'
import { collection, doc, getDoc, setDoc, query, where, getDocs, updateDoc, deleteDoc, addDoc, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

const REGISTRATIONS_COLLECTION = 'player-registrations'
const CHATS_COLLECTION = 'chats'
const MESSAGES_COLLECTION = 'messages'
const DOCUMENTS_COLLECTION = 'registration-documents'
const STORAGE_FOLDER = 'player-registrations'
console.log('[DEBUG] registration-firebase loaded, collection:', REGISTRATIONS_COLLECTION)

// Compress image before upload
export async function compressImage(file: File, maxWidth: number = 400, maxHeight: number = 400, quality: number = 0.3): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height
      
      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }
      
      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }
      
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            URL.revokeObjectURL(img.src)
            resolve(compressedFile)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        file.type,
        quality
      )
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      reject(new Error('Failed to load image'))
    }
  })
}

// Upload file to backend API (PostgreSQL database)
export async function uploadFileToStorage(file: File, fileType: string): Promise<string> {
  try {
    console.log('[DEBUG] Uploading file to backend API:', fileType)
    console.log('[DEBUG] File size:', file.size, 'bytes')
    console.log('[DEBUG] File type:', file.type)
    
    // Compress images aggressively before upload
    let fileToUpload = file
    if (file.type.startsWith('image/')) {
      console.log('[DEBUG] Compressing image aggressively...')
      fileToUpload = await compressImage(file, 400, 400, 0.3)
      console.log('[DEBUG] Compressed file size:', fileToUpload.size, 'bytes (reduced from', file.size, 'bytes)')
    }
    
    const formData = new FormData()
    formData.append('file', fileToUpload)
    formData.append('fileType', fileType)
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://iwkl-backend-lg6t-production.up.railway.app/api'
    const response = await fetch(`${apiUrl}/files/upload`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('[DEBUG] Backend upload error:', errorText)
      throw new Error(errorText || 'Upload failed')
    }
    
    const result = await response.json()
    console.log('[DEBUG] File uploaded successfully:', result.url)
    return result.url
  } catch (error: any) {
    console.error('[DEBUG] Error uploading file to backend:', error)
    throw new Error(`Upload failed: ${error.message}`)
  }
}

// Convert file to base64 (for fallback)
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}


// Check if user has existing registration by UID
export async function checkRegistrationByUID(uid: string): Promise<any> {
  console.log('[DEBUG] checkRegistrationByUID called with uid:', uid)
  try {
    const registrationRef = doc(db, REGISTRATIONS_COLLECTION, uid)
    console.log('[DEBUG] Querying Firestore for registration with uid:', uid)
    const registrationDoc = await getDoc(registrationRef)
    console.log('[DEBUG] Registration doc exists:', registrationDoc.exists())
    
    if (registrationDoc.exists()) {
      const data = { id: registrationDoc.id, ...registrationDoc.data() } as any
      console.log('[DEBUG] Registration found:', data.registrationId)
      return data
    }
    console.log('[DEBUG] No registration found for uid:', uid)
    return null
  } catch (error) {
    console.log('[DEBUG] Error checking registration by UID:', error)
    throw error
  }
}

// Generate unique registration ID
export async function generateRegistrationId(): Promise<string> {
  try {
    // Get the current year
    const year = new Date().getFullYear()
    
    // Query to find the highest registration number for this year
    const registrationsRef = collection(db, REGISTRATIONS_COLLECTION)
    const q = query(registrationsRef, where('registrationId', '>=', `IWKL-${year}-`), where('registrationId', '<', `IWKL-${year + 1}-`))
    const querySnapshot = await getDocs(q)
    
    let maxNumber = 0
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.registrationId) {
        const parts = data.registrationId.split('-')
        if (parts.length === 3) {
          const number = parseInt(parts[2], 10)
          if (!isNaN(number) && number > maxNumber) {
            maxNumber = number
          }
        }
      }
    })
    
    // Increment and format as 6-digit number
    const nextNumber = (maxNumber + 1).toString().padStart(6, '0')
    return `IWKL-${year}-${nextNumber}`
  } catch (error) {
    console.error('Error generating registration ID:', error)
    // Fallback to timestamp-based ID if query fails
    const year = new Date().getFullYear()
    const timestamp = Date.now().toString().slice(-6)
    return `IWKL-${year}-${timestamp}`
  }
}

// Create player registration in Firestore
export async function createRegistration(uid: string, registrationData: any): Promise<string> {
  try {
    const registrationId = await generateRegistrationId()
    
    const newRegistration = {
      ...registrationData,
      uid,
      registrationId,
      status: 'Pending',
      isLocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await setDoc(doc(db, REGISTRATIONS_COLLECTION, uid), newRegistration)
    return registrationId
  } catch (error) {
    console.error('Error creating registration:', error)
    throw error
  }
}

// Update player registration
export async function updateRegistration(uid: string, updateData: any): Promise<void> {
  try {
    const registrationRef = doc(db, REGISTRATIONS_COLLECTION, uid)
    await updateDoc(registrationRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating registration:', error)
    throw error
  }
}

// Delete player registration
export async function deleteRegistration(uid: string): Promise<void> {
  try {
    const registrationRef = doc(db, REGISTRATIONS_COLLECTION, uid)
    await deleteDoc(registrationRef)
  } catch (error) {
    console.error('Error deleting registration:', error)
    throw error
  }
}

// Get all registrations (for admin)
export async function getAllRegistrations(): Promise<any[]> {
  try {
    const registrationsRef = collection(db, REGISTRATIONS_COLLECTION)
    const querySnapshot = await getDocs(registrationsRef)
    
    const registrations: any[] = []
    querySnapshot.forEach((doc) => {
      registrations.push({ id: doc.id, ...doc.data() })
    })
    
    return registrations
  } catch (error) {
    console.error('Error getting all registrations:', error)
    throw error
  }
}

// Get next registration in filtered list
export async function getNextRegistration(currentId: string, filters: any): Promise<string | null> {
  try {
    const allRegistrations = await getAllRegistrations()
    
    // Apply filters
    let filtered = [...allRegistrations]
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter((reg) =>
        reg.fullName?.toLowerCase().includes(searchLower) ||
        reg.registrationId?.toLowerCase().includes(searchLower) ||
        reg.mobile?.toLowerCase().includes(searchLower) ||
        reg.email?.toLowerCase().includes(searchLower)
      )
    }
    
    if (filters.state && filters.state !== 'all') {
      filtered = filtered.filter((reg) => reg.state === filters.state)
    }
    
    if (filters.position && filters.position !== 'all') {
      filtered = filtered.filter((reg) => reg.playingPosition === filters.position)
    }
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((reg) => reg.status === filters.status)
    }
    
    // Add date filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate)
      filtered = filtered.filter((reg) => {
        const regDate = new Date(reg.createdAt)
        return regDate >= startDate
      })
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((reg) => {
        const regDate = new Date(reg.createdAt)
        return regDate <= endDate
      })
    }
    
    // Sort by registration ID (sequential order)
    filtered.sort((a: any, b: any) => {
      const idA = a.registrationId || ''
      const idB = b.registrationId || ''
      return idA.localeCompare(idB)
    })
    
    // Find current index
    const currentIndex = filtered.findIndex((reg) => reg.id === currentId)
    
    if (currentIndex === -1 || currentIndex === filtered.length - 1) {
      return null // No next registration
    }
    
    return filtered[currentIndex + 1].id
  } catch (error) {
    console.error('Error getting next registration:', error)
    throw error
  }
}

// Get previous registration in filtered list
export async function getPreviousRegistration(currentId: string, filters: any): Promise<string | null> {
  try {
    const allRegistrations = await getAllRegistrations()
    
    // Apply filters
    let filtered = [...allRegistrations]
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter((reg) =>
        reg.fullName?.toLowerCase().includes(searchLower) ||
        reg.registrationId?.toLowerCase().includes(searchLower) ||
        reg.mobile?.toLowerCase().includes(searchLower) ||
        reg.email?.toLowerCase().includes(searchLower)
      )
    }
    
    if (filters.state && filters.state !== 'all') {
      filtered = filtered.filter((reg) => reg.state === filters.state)
    }
    
    if (filters.position && filters.position !== 'all') {
      filtered = filtered.filter((reg) => reg.playingPosition === filters.position)
    }
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((reg) => reg.status === filters.status)
    }
    
    // Add date filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate)
      filtered = filtered.filter((reg) => {
        const regDate = new Date(reg.createdAt)
        return regDate >= startDate
      })
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((reg) => {
        const regDate = new Date(reg.createdAt)
        return regDate <= endDate
      })
    }
    
    // Sort by registration ID (sequential order)
    filtered.sort((a: any, b: any) => {
      const idA = a.registrationId || ''
      const idB = b.registrationId || ''
      return idA.localeCompare(idB)
    })
    
    // Find current index
    const currentIndex = filtered.findIndex((reg) => reg.id === currentId)
    
    if (currentIndex <= 0) {
      return null // No previous registration
    }
    
    return filtered[currentIndex - 1].id
  } catch (error) {
    console.error('Error getting previous registration:', error)
    throw error
  }
}

// Update registration status (for admin)
export async function updateRegistrationStatus(uid: string, status: string, trialDetails?: any): Promise<void> {
  try {
    const registrationRef = doc(db, REGISTRATIONS_COLLECTION, uid)
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString()
    }
    
    // Add trial details if provided
    if (trialDetails) {
      updateData.trialDate = trialDetails.trialDate
      updateData.trialVenue = trialDetails.trialVenue
      updateData.trialTime = trialDetails.trialTime
    }
    
    await updateDoc(registrationRef, updateData)
  } catch (error) {
    console.error('Error updating registration status:', error)
    throw error
  }
}

// Lock/Unlock registration (for admin)
export async function lockRegistration(uid: string, isLocked: boolean): Promise<void> {
  try {
    const registrationRef = doc(db, REGISTRATIONS_COLLECTION, uid)
    await updateDoc(registrationRef, {
      isLocked,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error locking registration:', error)
    throw error
  }
}

// Upload file to Firebase Storage
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Upload base64 data to Firebase Storage
export async function uploadBase64(base64Data: string, path: string): Promise<string> {
  try {
    // Convert base64 to blob
    const response = await fetch(base64Data)
    const blob = await response.blob()
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, blob)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error('Error uploading base64:', error)
    throw error
  }
}

// Chat functions

// Get or create chat between admin and user
export async function getOrCreateChat(userUid: string, adminUid: string): Promise<string> {
  try {
    // Check if chat already exists
    const chatsRef = collection(db, CHATS_COLLECTION)
    const q = query(chatsRef, where('userUid', '==', userUid), where('adminUid', '==', adminUid))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id
    }
    
    // Create new chat
    const newChat = await addDoc(chatsRef, {
      userUid,
      adminUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null,
      unreadByUser: 0,
      unreadByAdmin: 0
    })
    
    return newChat.id
  } catch (error) {
    console.error('Error getting or creating chat:', error)
    throw error
  }
}

// Send message in chat
export async function sendMessage(chatId: string, senderId: string, senderName: string, message: string, isAdmin: boolean): Promise<void> {
  try {
    const messagesRef = collection(db, CHATS_COLLECTION, chatId, MESSAGES_COLLECTION)
    await addDoc(messagesRef, {
      senderId,
      senderName,
      message,
      isAdmin,
      timestamp: serverTimestamp(),
      read: false
    })
    
    // Update chat's last message and timestamp
    const chatRef = doc(db, CHATS_COLLECTION, chatId)
    await updateDoc(chatRef, {
      lastMessage: message,
      updatedAt: serverTimestamp(),
      unreadByUser: isAdmin ? 1 : 0,
      unreadByAdmin: isAdmin ? 0 : 1
    })
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}

// Subscribe to chat messages in real-time
export function subscribeToMessages(chatId: string, callback: (messages: any[]) => void) {
  const messagesRef = collection(db, CHATS_COLLECTION, chatId, MESSAGES_COLLECTION)
  const q = query(messagesRef, orderBy('timestamp', 'asc'))
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages: any[] = []
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() })
    })
    callback(messages)
  })
  
  return unsubscribe
}

// Mark messages as read
export async function markMessagesAsRead(chatId: string, isAdmin: boolean): Promise<void> {
  try {
    const chatRef = doc(db, CHATS_COLLECTION, chatId)
    const updateData: any = {}
    
    if (isAdmin) {
      updateData.unreadByAdmin = 0
    } else {
      updateData.unreadByUser = 0
    }
    
    await updateDoc(chatRef, updateData)
  } catch (error) {
    console.error('Error marking messages as read:', error)
    throw error
  }
}

// Get all chats for admin
export async function getAdminChats(adminUid: string): Promise<any[]> {
  try {
    const chatsRef = collection(db, CHATS_COLLECTION)
    const q = query(chatsRef, where('adminUid', '==', adminUid))
    const querySnapshot = await getDocs(q)
    
    const chats: any[] = []
    querySnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() })
    })
    
    return chats
  } catch (error) {
    console.error('Error getting admin chats:', error)
    throw error
  }
}

// Get unread message count for user
export async function getUnreadCount(userUid: string, adminUid: string, isAdmin: boolean): Promise<number> {
  try {
    const chatsRef = collection(db, CHATS_COLLECTION)
    const q = query(chatsRef, where('userUid', '==', userUid), where('adminUid', '==', adminUid))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const chat = querySnapshot.docs[0].data()
      return isAdmin ? chat.unreadByAdmin || 0 : chat.unreadByUser || 0
    }
    
    return 0
  } catch (error) {
    console.error('Error getting unread count:', error)
    return 0
  }
}

// Subscribe to chat for unread count updates
export function subscribeToChat(userUid: string, adminUid: string, callback: (chat: any) => void) {
  const chatsRef = collection(db, CHATS_COLLECTION)
  const q = query(chatsRef, where('userUid', '==', userUid), where('adminUid', '==', adminUid))
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const chat = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
      callback(chat)
    } else {
      callback(null)
    }
  })
  
  return unsubscribe
}
