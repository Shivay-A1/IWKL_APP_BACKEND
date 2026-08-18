import { db } from './firebase'
import { collection, doc, getDoc, setDoc, query, where, getDocs, updateDoc } from 'firebase/firestore'
import { hashPassword } from './crypto'

const USERS_COLLECTION = 'users'
console.log('[DEBUG] auth-firebase loaded, collection:', USERS_COLLECTION)

// Check if user exists by mobile number
export async function checkUserByMobile(mobile: string): Promise<boolean> {
  console.log('[DEBUG] checkUserByMobile called with:', mobile)
  try {
    const usersRef = collection(db, USERS_COLLECTION)
    const q = query(usersRef, where('phoneNumber', '==', mobile))
    console.log('[DEBUG] Querying Firestore for mobile:', mobile)
    const querySnapshot = await getDocs(q)
    console.log('[DEBUG] Query result empty:', querySnapshot.empty)
    console.log('[DEBUG] Query result size:', querySnapshot.size)
    return !querySnapshot.empty
  } catch (error) {
    console.log('[DEBUG] Error checking user by mobile:', error)
    throw error
  }
}

// Check if user exists by email
export async function checkUserByEmail(email: string): Promise<boolean> {
  console.log('[DEBUG] checkUserByEmail called with:', email)
  try {
    const usersRef = collection(db, USERS_COLLECTION)
    const q = query(usersRef, where('email', '==', email))
    console.log('[DEBUG] Querying Firestore for email:', email)
    const querySnapshot = await getDocs(q)
    console.log('[DEBUG] Query result empty:', querySnapshot.empty)
    console.log('[DEBUG] Query result size:', querySnapshot.size)
    return !querySnapshot.empty
  } catch (error) {
    console.log('[DEBUG] Error checking user by email:', error)
    throw error
  }
}

// Get user by mobile number
export async function getUserByMobile(mobile: string): Promise<any> {
  console.log('[DEBUG] getUserByMobile called with:', mobile)
  try {
    const usersRef = collection(db, USERS_COLLECTION)
    const q = query(usersRef, where('phoneNumber', '==', mobile))
    console.log('[DEBUG] Querying Firestore for mobile:', mobile)
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      console.log('[DEBUG] No user found with mobile:', mobile)
      return null
    }
    
    const userDoc = querySnapshot.docs[0]
    const user = { id: userDoc.id, ...userDoc.data() }
    console.log('[DEBUG] User found:', user.id)
    return user
  } catch (error) {
    console.log('[DEBUG] Error getting user by mobile:', error)
    throw error
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<any> {
  console.log('[DEBUG] getUserByEmail called with:', email)
  try {
    const usersRef = collection(db, USERS_COLLECTION)
    const q = query(usersRef, where('email', '==', email))
    console.log('[DEBUG] Querying Firestore for email:', email)
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      console.log('[DEBUG] No user found with email:', email)
      return null
    }
    
    const userDoc = querySnapshot.docs[0]
    const user = { id: userDoc.id, ...userDoc.data() }
    console.log('[DEBUG] User found:', user.id)
    return user
  } catch (error) {
    console.log('[DEBUG] Error getting user by email:', error)
    throw error
  }
}

// Create new user in Firestore
export async function createUser(userData: any): Promise<void> {
  console.log('[DEBUG] createUser called with uid:', userData.uid)
  try {
    const passwordHash = await hashPassword(userData.password)
    console.log('[DEBUG] Password hashed')
    
    const newUser: any = {
      uid: userData.uid,
      fullName: userData.name,
      passwordHash,
      createdAt: new Date().toISOString(),
      verified: true
    }
    
    // Add mobile or email based on signup method
    if (userData.mobile) {
      newUser.phoneNumber = userData.mobile
      newUser.mobileVerified = true
    }
    
    if (userData.email) {
      newUser.email = userData.email
      newUser.emailVerified = true
    }
    
    console.log('[DEBUG] Creating user document in Firestore:', newUser)
    
    await setDoc(doc(db, USERS_COLLECTION, userData.uid), newUser)
    console.log('[DEBUG] User document created successfully')
  } catch (error) {
    console.log('[DEBUG] Error creating user:', error)
    throw error
  }
}

// Verify user credentials for login (mobile)
export async function verifyCredentials(mobile: string, password: string): Promise<any> {
  console.log('[DEBUG] verifyCredentials called with mobile:', mobile)
  try {
    const user = await getUserByMobile(mobile)
    
    if (!user) {
      console.log('[DEBUG] User not found for mobile:', mobile)
      throw new Error('Account not found')
    }
    
    const passwordHash = await hashPassword(password)
    console.log('[DEBUG] Password hashed for comparison')
    
    if (user.passwordHash !== passwordHash) {
      console.log('[DEBUG] Password mismatch')
      throw new Error('Incorrect password')
    }
    
    console.log('[DEBUG] Credentials verified successfully')
    return user
  } catch (error) {
    console.log('[DEBUG] Error verifying credentials:', error)
    throw error
  }
}

// Verify user credentials for login (email)
export async function verifyEmailCredentials(email: string, password: string): Promise<any> {
  console.log('[DEBUG] verifyEmailCredentials called with email:', email)
  try {
    const user = await getUserByEmail(email)
    
    if (!user) {
      console.log('[DEBUG] User not found for email:', email)
      throw new Error('Account not found')
    }
    
    const passwordHash = await hashPassword(password)
    console.log('[DEBUG] Password hashed for comparison')
    
    if (user.passwordHash !== passwordHash) {
      console.log('[DEBUG] Password mismatch')
      throw new Error('Incorrect password')
    }
    
    console.log('[DEBUG] Email credentials verified successfully')
    return user
  } catch (error) {
    console.log('[DEBUG] Error verifying email credentials:', error)
    throw error
  }
}

// Update user password
export async function updateUserPassword(identifier: string, newPassword: string, isEmail: boolean = false): Promise<void> {
  console.log('[DEBUG] updateUserPassword called for identifier:', identifier)
  try {
    const user = isEmail ? await getUserByEmail(identifier) : await getUserByMobile(identifier)
    
    if (!user) {
      console.log('[DEBUG] No account found with identifier:', identifier)
      throw new Error('No account found with this identifier')
    }
    
    const passwordHash = await hashPassword(newPassword)
    console.log('[DEBUG] New password hashed')
    
    await updateDoc(doc(db, USERS_COLLECTION, user.id), {
      passwordHash
    })
    console.log('[DEBUG] Password updated successfully')
  } catch (error) {
    console.log('[DEBUG] Error updating password:', error)
    throw error
  }
}
