"use client"

import { usePathname } from 'next/navigation'
import Sidebar from './sidebar'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Skip auth check for login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (isLoginPage) {
      setLoading(false)
      return
    }

    // Check admin token in localStorage
    const adminToken = localStorage.getItem('adminToken')
    const adminUser = localStorage.getItem('adminUser')

    console.log('🔵 AdminLayout Auth Check:', {
      hasAdminToken: !!adminToken,
      hasAdminUser: !!adminUser,
      adminTokenPreview: adminToken ? adminToken.substring(0, 20) + '...' : 'none',
      allKeys: Object.keys(localStorage)
    })

    if (!adminToken || !adminUser) {
      console.log('AdminLayout - No token or user, redirecting to login')
      setIsAuthenticated(false)
      window.location.href = '/admin/login'
      return
    }

    // Validate adminUser is valid JSON
    try {
      JSON.parse(adminUser)
      setIsAuthenticated(true)
      setLoading(false)
    } catch (err) {
      console.error('AdminLayout - Invalid adminUser JSON, redirecting to login')
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      setIsAuthenticated(false)
      window.location.href = '/admin/login'
      return
    }
  }, [pathname, router, isLoginPage, mounted])

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render admin layout for login page
  if (isLoginPage) {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0 overflow-hidden">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
