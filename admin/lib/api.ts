import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://iwklappbackend-production.up.railway.app/api'

// Simple in-memory cache for GET requests
const cache = new Map()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes (increased from 5)

// Cache invalidation function
export const invalidateCache = (pattern?: string) => {
  if (pattern) {
    // Invalidate cache entries matching the pattern
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key)
      }
    }
  } else {
    // Clear all cache
    cache.clear()
  }
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // 30 second timeout (reduced from 60s)
  maxRedirects: 0,
  // Force HTTP/1.1 by disabling HTTP/2
  httpAgent: new (require('http').Agent)({ keepAlive: false }),
  httpsAgent: new (require('https').Agent)({ keepAlive: false, rejectUnauthorized: false }),
})

// Add response caching for GET requests
api.interceptors.response.use(
  (response) => {
    // Only cache GET requests (skip auth endpoints and admin routes)
    if (response.config.method === 'get' && 
        !response.config.url?.includes('/auth') &&
        !response.config.url?.includes('/admin')) {
      const cacheKey = response.config.url || ''
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      })
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add request interceptor to check cache
api.interceptors.request.use(
  (config) => {
    // Check cache for GET requests (skip for auth endpoints and admin routes)
    if (config.method === 'get' && 
        !config.url?.includes('/auth') &&
        !config.url?.includes('/admin')) {
      const cacheKey = config.url || ''
      const cached = cache.get(cacheKey)
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        // Return cached data
        config.adapter = () => Promise.resolve({
          data: cached.data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        })
      }
    }
    
    // Token is handled via httpOnly cookies
    // Remove Content-Type header for FormData to let axios set it automatically with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    // Add Authorization header from localStorage for admin routes only
    if (typeof window !== 'undefined') {
      // Use adminToken for admin routes, regular token for other routes
      // Only treat actual admin routes as requiring adminToken
      const isAdminRoute = config.url?.startsWith('/admin') ||
                          config.url?.startsWith('/homepage-banners') ||
                          config.url?.startsWith('/news') ||
                          config.url?.startsWith('/gallery') ||
                          config.url?.includes('/social-media-partner/export') ||
                          (config.url?.startsWith('/social-media-partner') && !config.url?.includes('/user/') && !config.url?.includes('/register') && !config.url?.includes('/history'))

      const token = isAdminRoute
        ? localStorage.getItem('adminToken')
        : localStorage.getItem('token') || localStorage.getItem('accessToken')

      console.log('🔵 Auth Debug:', {
        url: config.url,
        isAdminRoute,
        tokenKey: isAdminRoute ? 'adminToken' : 'token/accessToken',
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
      })

      // Add Authorization header for admin routes
      if (isAdminRoute && token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Public endpoints that don't require authentication (GET requests only)
      const publicEndpoints = [
        '/matches',
        '/seasons',
        '/players',
        '/stadiums',
        '/teams',
        '/points-table',
        '/points',
        '/videos',
        '/videos/featured',
        '/news/featured',
        '/sponsors/active',
        '/banners/active',
        '/champions',
        '/leadership',
        '/footer',
        '/unplugged',
        '/unplugged/categories',
        '/unplugged/videos',
      ]

      // Check if endpoint is public
      const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.startsWith(endpoint))

      // Skip adding Authorization header for Firestore-only users (placeholder token)
      const isFirestoreToken = token === 'firestore-token'

      // Endpoints that should work without backend authentication for Firestore users
      const firestoreUserEndpoints = [
        '/users/favorites',
        '/notifications',
        '/auth/profile',
        '/social-media-partner/user/',
        '/social-media-partner/register',
      ]

      const isFirestoreUserEndpoint = firestoreUserEndpoints.some(endpoint => config.url?.startsWith(endpoint))

      // Add Authorization header if token exists, endpoint is not public, and not a Firestore-only user on Firestore endpoints
      if (token && !isPublicEndpoint && !(isFirestoreToken && isFirestoreUserEndpoint)) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('✅ Adding Authorization header for:', config.url, 'with token:', token.substring(0, 20) + '...')
      } else if (!token && !isPublicEndpoint && !isFirestoreUserEndpoint) {
        console.warn('❌ No token found in localStorage for protected endpoint:', config.url)
      } else if (isFirestoreToken && isFirestoreUserEndpoint) {
        console.log('⏭️ Skipping Authorization header for Firestore user on endpoint:', config.url)
      }
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // Don't retry if already tried refreshing
    if (originalRequest._retry) {
      return Promise.reject(error)
    }
    
    // Check if user is a Firestore-only user (has placeholder token)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const isFirestoreUser = token === 'firestore-token'
    
    // If Firestore-only user gets 401, just return error without redirecting
    // They should use Firestore-only features instead of backend APIs
    if (isFirestoreUser && error.response?.status === 401) {
      console.log('Firestore-only user got 401, skipping redirect')
      return Promise.reject(error)
    }
    
    // Public routes that should NOT redirect to login on 401
    const publicRoutes = [
      '/',
      '/home',
      '/about',
      '/teams',
      '/matches',
      '/gallery',
      '/news',
      '/fan-club',
      '/contact',
      '/points',
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/verify-otp',
      '/social-media-partner-registration',
      '/my-social-media-partner-registration'
    ]
    
    // Auth routes that should not redirect
    const authRoutes = ['/auth/profile', '/auth/login', '/auth/register', '/auth/logout', '/auth/refresh']
    
    // Don't redirect if we're already on a login page
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    const isLoginPage = currentPath.includes('/login')
    
    // Check if current path is a public route
    const isPublicRoute = publicRoutes.some(route => currentPath === route || currentPath.startsWith(route))
    
    // If 401 error and not on public/auth route, try to refresh token
    if (error.response?.status === 401 && !isPublicRoute && !authRoutes.includes(error.config?.url) && !isLoginPage) {
      try {
        originalRequest._retry = true
        
        // Call refresh endpoint (uses refresh token from cookies)
        const refreshResponse = await api.post('/auth/refresh')
        
        if (refreshResponse.data.accessToken) {
          // Update localStorage with new access token
          localStorage.setItem('adminToken', refreshResponse.data.accessToken)
          
          // Update Authorization header for original request
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`
          
          // Retry original request
          return api(originalRequest)
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          if (currentPath.startsWith('/admin')) {
            window.location.href = '/admin/login'
          } else {
            window.location.href = '/auth/login'
          }
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export default api

// API service functions
export const apiService = {
  // Auth
  auth: {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data: any) => api.put('/auth/profile', data),
    forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
    verifyOTP: (email: string, otp: string) => api.post('/auth/verify-otp', { email, otp }),
    resetPassword: (email: string, newPassword: string) => api.post('/auth/reset-password', { email, newPassword }),
    changePassword: (currentPassword: string, newPassword: string) => api.post('/auth/change-password', { currentPassword, newPassword }),
  },

  // Seasons
  seasons: {
    getAll: (params?: any) => api.get('/seasons', { params }),
    getById: (id: string) => api.get(`/seasons/${id}`),
    create: (data: any) => api.post('/seasons', data),
    update: (id: string, data: any) => api.put(`/seasons/${id}`, data),
    delete: (id: string) => api.delete(`/seasons/${id}`),
    setActive: (id: string) => api.patch(`/seasons/${id}/activate`),
  },

  // Teams
  teams: {
    getAll: (params?: any) => api.get('/teams', { params: { ...params, isActive: true, limit: 100 } }),
    getAllIncludingInactive: (params?: any) => api.get('/teams', { params: { ...params, limit: 100 } }),
    getById: (id: string) => api.get(`/teams/${id}`),
    create: (data: any) => api.post('/teams', data).then((response) => {
      invalidateCache('/teams')
      invalidateCache('/points')
      invalidateCache('/points-table')
      invalidateCache('/homepage')
      return response
    }),
    update: (id: string, data: any) => api.put(`/teams/${id}`, data).then((response) => {
      invalidateCache('/teams')
      invalidateCache('/points')
      invalidateCache('/points-table')
      invalidateCache('/homepage')
      return response
    }),
    delete: (id: string) => api.delete(`/teams/${id}`).then((response) => {
      invalidateCache('/teams')
      invalidateCache('/points')
      invalidateCache('/points-table')
      invalidateCache('/homepage')
      return response
    }),
    getStats: (id: string) => api.get(`/teams/${id}/stats`),
  },

  // Stadiums
  stadiums: {
    getAll: (params?: any) => api.get('/stadiums', { params }),
    getById: (id: string) => api.get(`/stadiums/${id}`),
    create: (data: any) => api.post('/stadiums', data),
    update: (id: string, data: any) => api.put(`/stadiums/${id}`, data),
    delete: (id: string) => api.delete(`/stadiums/${id}`),
  },

  // Players
  players: {
    getAll: (params?: any) => api.get('/players', { params }),
    getById: (id: string) => api.get(`/players/${id}`),
    create: (data: any) => api.post('/players', data),
    update: (id: string, data: any) => api.put(`/players/${id}`, data),
    delete: (id: string) => api.delete(`/players/${id}`),
    getByTeam: (teamId: string) => api.get(`/players/team/${teamId}`),
  },

  // Matches
  matches: {
    getAll: (params?: any) => api.get('/matches', { params }),
    getById: (id: string) => api.get(`/matches/${id}`),
    create: (data: any) => api.post('/matches', data).then((response) => {
      invalidateCache('/matches')
      invalidateCache('/matches/upcoming')
      invalidateCache('/matches/live')
      invalidateCache('/homepage')
      return response
    }),
    update: (id: string, data: any) => api.put(`/matches/${id}`, data).then((response) => {
      invalidateCache('/matches')
      invalidateCache('/matches/upcoming')
      invalidateCache('/matches/live')
      invalidateCache('/matches/completed')
      invalidateCache('/homepage')
      return response
    }),
    delete: (id: string) => api.delete(`/matches/${id}`).then((response) => {
      invalidateCache('/matches')
      invalidateCache('/matches/upcoming')
      invalidateCache('/matches/live')
      invalidateCache('/matches/completed')
      invalidateCache('/homepage')
      return response
    }),
    duplicate: (id: string) => api.post(`/matches/${id}/duplicate`).then((response) => {
      invalidateCache('/matches')
      invalidateCache('/matches/upcoming')
      invalidateCache('/homepage')
      return response
    }),
    publish: (id: string, data: any) => api.patch(`/matches/${id}/publish`, data).then((response) => {
      invalidateCache('/matches')
      invalidateCache('/matches/upcoming')
      invalidateCache('/homepage')
      return response
    }),
    updateScore: (id: string, data: any) => api.patch(`/matches/${id}/score`, data).then((response) => {
      invalidateCache('/matches')
      invalidateCache('/matches/live')
      invalidateCache('/matches/completed')
      invalidateCache('/points')
      invalidateCache('/points-table')
      invalidateCache('/homepage')
      return response
    }),
    updateLiveScore: (id: string, data: any) => api.patch(`/matches/${id}/live-score`, data).then((response) => {
      invalidateCache('/matches')
      invalidateCache('/matches/live')
      invalidateCache('/homepage')
      return response
    }),
    updateStatus: (id: string, data: any) => api.patch(`/matches/${id}/status`, data).then((response) => {
      invalidateCache('/matches')
      invalidateCache('/matches/upcoming')
      invalidateCache('/matches/live')
      invalidateCache('/matches/completed')
      invalidateCache('/homepage')
      return response
    }),
    getUpcoming: (params?: any) => api.get('/matches/upcoming', { params }),
    getLive: () => api.get('/matches/live'),
    getCompleted: (params?: any) => api.get('/matches/completed', { params }),
    startMatch: (id: string) => api.post(`/matches/${id}/start`).then((response) => {
      invalidateCache('/matches')
      invalidateCache('/matches/upcoming')
      invalidateCache('/matches/live')
      invalidateCache('/homepage')
      return response
    }),
    pauseMatch: (id: string) => api.post(`/matches/${id}/pause`).then((response) => {
      invalidateCache('/matches')
      invalidateCache('/matches/live')
      invalidateCache('/homepage')
      return response
    }),
    resumeMatch: (id: string) => api.post(`/matches/${id}/resume`).then((response) => {
      invalidateCache('/matches')
      invalidateCache('/matches/live')
      invalidateCache('/homepage')
      return response
    }),
    endMatch: (id: string, data: any) => api.post(`/matches/${id}/end`, data).then((response) => {
      invalidateCache('/matches')
      invalidateCache('/matches/live')
      invalidateCache('/matches/completed')
      invalidateCache('/points')
      invalidateCache('/points-table')
      invalidateCache('/homepage')
      return response
    }),
    rollback: (id: string, historyId: string) => api.post(`/matches/${id}/rollback/${historyId}`).then((response) => {
      invalidateCache('/matches')
      invalidateCache('/matches/live')
      invalidateCache('/homepage')
      return response
    }),
  },

  // Points Table
  points: {
    getTable: (params?: any) => api.get('/points', { params }),
    getBySeason: (seasonId: string) => api.get(`/points/season/${seasonId}`),
    update: (id: string, data: any) => api.put(`/points/${id}`, data).then((response) => {
      invalidateCache('/points')
      invalidateCache('/points-table')
      invalidateCache('/teams')
      return response
    }),
    recalculate: (seasonId: string) => api.post(`/points/season/${seasonId}/recalculate`).then((response) => {
      invalidateCache('/points')
      invalidateCache('/points-table')
      invalidateCache('/teams')
      return response
    }),
  },

  // Points Table (Enhanced)
  pointsTable: {
    getAll: (params?: any) => api.get('/points-table', { params }),
    getBySeason: (seasonId: string) => api.get(`/points-table/season/${seasonId}`),
    create: (data: any) => api.post('/points-table', data).then((response) => {
      invalidateCache('/points')
      invalidateCache('/points-table')
      invalidateCache('/teams')
      return response
    }),
    update: (id: string, data: any) => api.put(`/points-table/${id}`, data).then((response) => {
      invalidateCache('/points')
      invalidateCache('/points-table')
      invalidateCache('/teams')
      return response
    }),
    delete: (id: string) => api.delete(`/points-table/${id}`).then((response) => {
      invalidateCache('/points')
      invalidateCache('/points-table')
      invalidateCache('/teams')
      return response
    }),
  },

  // Videos
  videos: {
    getAll: (params?: any) => api.get('/videos', { params }),
    getById: (id: string) => api.get(`/videos/${id}`),
    create: (data: any) => api.post('/videos', data),
    update: (id: string, data: any) => api.put(`/videos/${id}`, data),
    delete: (id: string) => api.delete(`/videos/${id}`),
    getFeatured: () => api.get('/videos/featured'),
    getHomepage: () => api.get('/videos/homepage'),
  },

  // News
  news: {
    getAll: (params?: any) => api.get('/news', { params }),
    getById: (id: string) => api.get(`/news/${id}`),
    getBySlug: (slug: string) => api.get(`/news/slug/${slug}`),
    create: (data: any) => api.post('/news', data),
    createSimple: (data: any) => api.post('/news/simple', data),
    update: (id: string, data: any) => api.put(`/news/${id}`, data),
    updateSimple: (id: string, data: any) => api.put(`/news/${id}/simple`, data),
    delete: (id: string) => api.delete(`/news/${id}`),
    deleteAll: () => api.delete('/news/all'),
    getFeatured: () => api.get('/news/featured'),
    incrementViews: (id: string) => api.patch(`/news/${id}/views`),
  },

  // Gallery
  gallery: {
    getAll: (params?: any) => api.get('/gallery', { params }),
    getById: (id: string) => api.get(`/gallery/${id}`),
    create: (data: any) => api.post('/gallery', data),
    update: (id: string, data: any) => api.put(`/gallery/${id}`, data),
    delete: (id: string) => api.delete(`/gallery/${id}`),
    getByCategory: (category: string) => api.get(`/gallery/category/${category}`),
    getByAlbum: (album: string) => api.get(`/gallery/album/${album}`),
  },

  // Sponsors
  sponsors: {
    getAll: (params?: any) => api.get('/sponsors', { params }),
    getById: (id: string) => api.get(`/sponsors/${id}`),
    create: (data: any) => api.post('/sponsors', data),
    update: (id: string, data: any) => api.put(`/sponsors/${id}`, data),
    delete: (id: string) => api.delete(`/sponsors/${id}`),
    getActive: () => api.get('/sponsors/active'),
    getByCategory: (category: string) => api.get(`/sponsors/category/${category}`),
  },

  // Banners
  banners: {
    getAll: () => api.get('/banners'),
    getById: (id: string) => api.get(`/banners/${id}`),
    create: (data: any) => api.post('/banners', data),
    update: (id: string, data: any) => api.put(`/banners/${id}`, data),
    delete: (id: string) => api.delete(`/banners/${id}`),
    getActive: () => api.get('/banners/active'),
  },

  // Notifications
  notifications: {
    getAll: (params?: any) => api.get('/notifications', { params }),
    create: (data: any) => api.post('/notifications', data),
    markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
    markAllAsRead: () => api.patch('/notifications/read-all'),
    delete: (id: string) => api.delete(`/notifications/${id}`),
    broadcast: (data: any) => api.post('/notifications/broadcast', data),
  },

  // Users
  users: {
    getAll: (params?: any) => api.get('/users', { params }),
    getById: (id: string) => api.get(`/users/${id}`),
    update: (id: string, data: any) => api.put(`/users/${id}`, data),
    delete: (id: string) => api.delete(`/users/${id}`),
    updateRole: (id: string, role: string) => api.patch(`/users/${id}/role`, { role }),
    addFavorite: (teamId: string) => api.post('/users/favorites', { teamId }),
    removeFavorite: (teamId: string) => api.delete(`/users/favorites/${teamId}`),
    getFavorites: () => api.get('/users/favorites/list'),
    getDashboardStats: () => api.get('/users/dashboard/stats'),
  },

  // Champions
  champions: {
    getAll: (params?: any) => api.get('/champions', { params }),
    getById: (id: string) => api.get(`/champions/${id}`),
    getBySeason: (seasonId: string) => api.get(`/champions/season/${seasonId}`),
    create: (data: any) => api.post('/champions', data),
    update: (id: string, data: any) => api.put(`/champions/${id}`, data),
    delete: (id: string) => api.delete(`/champions/${id}`),
  },

  // Leadership
  leadership: {
    getAll: () => api.get('/leadership'),
    getById: (id: string) => api.get(`/leadership/${id}`),
    create: (data: any) => api.post('/leadership', data),
    update: (id: string, data: any) => api.put(`/leadership/${id}`, data),
    delete: (id: string) => api.delete(`/leadership/${id}`),
  },

  // Fan Club
  fanClub: {
    register: (data: any) => api.post('/fan-club/register', data),
    getAll: (search?: string) => api.get('/fan-club', { params: { search } }),
    getById: (id: string) => api.get(`/fan-club/${id}`),
    export: () => api.get('/fan-club/export/csv', { responseType: 'blob' }),
  },

  // Footer
  footer: {
    get: () => api.get('/footer'),
    update: (data: any) => api.put('/footer', data),
  },

  // Site Settings
  siteSettings: {
    get: () => api.get('/site-settings'),
    update: (data: any) => api.put('/site-settings', data),
  },

  // IWKL Unplugged
  unplugged: {
    // Categories
    getCategories: (params?: any) => api.get('/unplugged/categories', { params }),
    getCategoryById: (id: string) => api.get(`/unplugged/categories/${id}`),
    createCategory: (data: any) => api.post('/unplugged/categories', data),
    updateCategory: (id: string, data: any) => api.put(`/unplugged/categories/${id}`, data),
    deleteCategory: (id: string) => api.delete(`/unplugged/categories/${id}`),
    // Videos
    getVideos: (params?: any) => api.get('/unplugged/videos', { params }),
    getVideoById: (id: string) => api.get(`/unplugged/videos/${id}`),
    getVideosByCategory: (categoryId: string) => api.get(`/unplugged/categories/${categoryId}/videos`),
    createVideo: (data: any) => api.post('/unplugged/videos', data),
    updateVideo: (id: string, data: any) => api.put(`/unplugged/videos/${id}`, data),
    deleteVideo: (id: string) => api.delete(`/unplugged/videos/${id}`),
  },

  // Homepage - Single endpoint for all homepage data
  homepage: {
    getData: () => api.get('/homepage'),
  },

  // Social Media Partner Registration
  socialMediaPartner: {
    register: (data: any) => api.post('/social-media-partner/register', data),
    getAll: (params?: any) => api.get('/social-media-partner', { params }),
    getById: (id: string) => api.get(`/social-media-partner/${id}`),
    getByUserId: (userId: string) => api.get(`/social-media-partner/user/${userId}`),
    getStatusHistory: (id: string) => api.get(`/social-media-partner/${id}/history`),
    update: (id: string, data: any) => api.put(`/social-media-partner/${id}`, data),
    updateStatus: (id: string, data: any) => api.put(`/social-media-partner/${id}/status`, data),
    delete: (id: string) => api.delete(`/social-media-partner/${id}`),
    exportExcel: () => api.get('/social-media-partner/export/excel', { responseType: 'blob' }),
    exportPDF: () => api.get('/social-media-partner/export/pdf', { responseType: 'blob' }),
  },
}
