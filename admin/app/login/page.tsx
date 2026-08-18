"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setError('')
    setLoading(true)

    try {
      console.log('=== ADMIN LOGIN START ===')
      console.log('Attempting admin login with:', email)
      
      // Clear any existing corrupted data
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      
      // Call admin login API endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://iwklappbackend-production.up.railway.app/api'
      const response = await fetch(`${apiUrl}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      console.log('Login response status:', response.status)
      console.log('Login response ok:', response.ok)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Login error response:', errorData)
        throw new Error(errorData.error || 'Login failed')
      }

      const data = await response.json()
      console.log('Admin login response received:', data)
      console.log('Has accessToken:', !!data.accessToken)
      console.log('Has user:', !!data.user)
      
      // Check if user has admin role
      if (data.user.role !== 'SUPER_ADMIN' && data.user.role !== 'LEAGUE_ADMIN') {
        setError('Access denied. Admin privileges required.')
        setLoading(false)
        return
      }

      // Store admin session separately from user session
      console.log('Storing adminToken:', data.accessToken ? 'exists' : 'missing')
      console.log('Token value:', data.accessToken ? data.accessToken.substring(0, 50) + '...' : 'none')
      localStorage.setItem('adminToken', data.accessToken)

      const userJson = JSON.stringify(data.user)
      console.log('Storing adminUser as JSON:', userJson)
      localStorage.setItem('adminUser', userJson)

      // Verify storage
      const storedToken = localStorage.getItem('adminToken')
      const storedUser = localStorage.getItem('adminUser')
      console.log('Verification - storedToken:', storedToken ? 'exists' : 'missing')
      console.log('Verification - storedUser:', storedUser)
      console.log('All localStorage keys:', Object.keys(localStorage))
      
      if (!storedToken || !storedUser) {
        throw new Error('Failed to store admin session')
      }
      
      console.log('Admin session stored successfully, redirecting to dashboard')
      console.log('=== ADMIN LOGIN END ===')
      
      // Use window.location.href for hard redirect to ensure session is loaded
      window.location.href = '/admin/dashboard'
    } catch (err: any) {
      console.error('=== ADMIN LOGIN ERROR ===')
      console.error('Error object:', err)
      console.error('Error message:', err.message)
      console.error('Error response:', err.response)
      console.error('Error response data:', err.response?.data)
      console.error('=== END ERROR ===')
      
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: 'url("/loginpage.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-purple-900/10"></div>

      {/* Content */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center md:justify-end px-4 md:px-8 lg:px-16 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-[95%] md:w-auto max-w-[420px] md:max-w-[420px] lg:max-w-[480px] xl:max-w-[500px]"
          style={{ marginTop: '-220px', marginBottom: '-200px' }}
        >
          {/* Card */}
          <div 
            className="bg-white/95 backdrop-blur-[10px] rounded-[20px] overflow-hidden shadow-2xl border border-white/35"
          >
            {/* Purple Header */}
            <div className="p-4 pb-2 bg-gradient-to-br from-[#4B0F6B] to-[#800080]">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
                className="flex justify-center mb-2"
              >
                <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-lg">
                  <Lock className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center"
              >
                <h1 className="text-[18px] font-bold text-white mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Admin Panel Login
                </h1>
                <p className="text-[11px] text-white/90" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Secure admin access to IWKL platform
                </p>
              </motion.div>
            </div>

            {/* Form */}
            <div className="px-7 py-5">
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSubmit}
                className="space-y-3"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium shadow-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[#1E1E1E] text-xs font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Admin Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-[44px] px-3 border-[#E5E5E5] rounded-xl focus:border-[#6A11CB] focus:ring-2 focus:ring-[#6A11CB]/20 transition-all text-[14px]"
                    placeholder="Enter admin email"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-[#1E1E1E] text-xs font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-[44px] pl-10 pr-10 border-[#E5E5E5] rounded-xl focus:border-[#6A11CB] focus:ring-2 focus:ring-[#6A11CB]/20 transition-all text-[14px]"
                      placeholder="Enter admin password"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full h-[46px] rounded-xl font-bold text-[15px] transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-[#4B0F6B] to-[#800080] hover:from-[#800080] hover:to-[#4B0F6B] text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      'LOGIN TO ADMIN PANEL'
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center my-4"
              >
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-3 text-xs text-gray-400 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>OR</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </motion.div>

              {/* Back to Website Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => {
                    // Clear admin session and redirect to main page
                    localStorage.removeItem('adminToken')
                    localStorage.removeItem('adminUser')
                    window.location.href = '/'
                  }}
                  className="w-full h-[46px] rounded-xl font-bold text-[15px] transition-all duration-300 shadow-lg hover:shadow-xl bg-white border-2 border-[#4B0F6B] text-[#4B0F6B] hover:bg-[#4B0F6B] hover:text-white"
                >
                  Back to Website
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
