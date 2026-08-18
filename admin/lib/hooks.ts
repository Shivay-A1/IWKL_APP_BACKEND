import { useState, useEffect, useCallback } from 'react'
import api from './api'

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        setUser(null)
        return
      }
      
      // For Firestore-only users, use localStorage data directly
      if (token === 'firestore-token') {
        const userData = localStorage.getItem('user')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          // Ensure we have the name field correctly
          if (!parsedUser.name && parsedUser.fullName) {
            parsedUser.name = parsedUser.fullName
            localStorage.setItem('user', JSON.stringify(parsedUser))
          }
          setUser(parsedUser)
        }
        return
      }
      
      const response = await api.get('/auth/profile')
      setUser(response.data)
      // Update localStorage with fresh user data from backend
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (err: any) {
      // If 401, token is invalid - clear localStorage and redirect
      // But don't clear for Firestore-only users
      const token = localStorage.getItem('token')
      if (err.response?.status === 401 && token !== 'firestore-token') {
        console.log('Token invalid, clearing session')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setError('Session expired. Please login again.')
      } else if (err.response?.status === 401 && token === 'firestore-token') {
        // For Firestore users, just use localStorage data
        const userData = localStorage.getItem('user')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          if (!parsedUser.name && parsedUser.fullName) {
            parsedUser.name = parsedUser.fullName
            localStorage.setItem('user', JSON.stringify(parsedUser))
          }
          setUser(parsedUser)
        }
      } else {
        setError('Failed to fetch profile')
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }

  // Initialize user from localStorage on mount, then fetch fresh data
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        // Ensure we have the name field correctly
        if (!parsedUser.name && parsedUser.fullName) {
          parsedUser.name = parsedUser.fullName
          localStorage.setItem('user', JSON.stringify(parsedUser))
        }
        setUser(parsedUser)
      } catch (e) {
        console.error('Failed to parse user data from localStorage')
        localStorage.removeItem('user')
      }
    }
    // Only fetch fresh data if we have a token
    if (token) {
      fetchProfile()
    }
  }, [])

  const login = useCallback(async (mobile: string, password: string) => {
    try {
      setLoading(true)
      console.log('=== USE AUTH LOGIN START ===')
      console.log('Login request with:', mobile)
      const response = await api.post('/auth/login', { mobile, password })
      console.log('Login response:', response)
      console.log('Response data:', response.data)
      console.log('Response data user:', response.data.user)
      
      // Store user data and token in localStorage
      if (response.data.user && response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('token', response.data.accessToken)
        setUser(response.data.user)
      }
      
      console.log('=== USE AUTH LOGIN END ===')
      return response.data
    } catch (err: any) {
      console.error('=== USE AUTH LOGIN ERROR ===')
      console.error('Error:', err)
      console.error('Error response:', err.response)
      console.error('Error response data:', err.response?.data)
      console.error('=== END ERROR ===')
      setError(err.response?.data?.error || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = async () => {
    const token = localStorage.getItem('token')
    const isFirestore = token === 'firestore-token'
    
    if (!isFirestore) {
      try {
        await api.post('/auth/logout')
      } catch (err) {
        console.error('Logout API error:', err)
      }
    }
    
    setUser(null)
    // Clear localStorage on logout
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { user, loading, error, login, logout, refetch: fetchProfile }
}

export function useData<T>(
  fetchFn: () => Promise<any>,
  dependencies: any[] = [],
  defaultValue: any = null
) {
  const [data, setData] = useState<T | null>(defaultValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Skip data fetching during build time (SSG)
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }
    fetchData()
  }, dependencies)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetchFn()
      // Extract data from paginated responses: { data: [...], pagination: {...} }
      // If response has data property and it's an array, use that
      // Otherwise use the full response.data
      const extractedData = (response.data?.data && Array.isArray(response.data.data)) 
        ? response.data.data 
        : response.data
      setData(extractedData)
      return extractedData
    } catch (err: any) {
      // Don't set error for 401 - might be during build time or not authenticated
      if (err.response?.status !== 401) {
        setError(err.response?.data?.error || 'Failed to fetch data')
      }
      // Set data to default value on error to prevent TypeErrors
      setData(defaultValue)
      return defaultValue
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch: fetchData }
}
