"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    console.log('=== ADMIN PAGE LOAD ===')
    const adminToken = localStorage.getItem('adminToken')
    console.log('adminToken:', adminToken ? 'exists' : 'missing')
    
    if (adminToken) {
      console.log('Redirecting to dashboard')
      router.push('/admin/dashboard')
    } else {
      console.log('Redirecting to login')
      router.push('/admin/login')
    }
    console.log('=== ADMIN PAGE LOAD END ===')
  }, [router, mounted])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2B123A]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2B123A]">
      <div className="text-white">Loading...</div>
    </div>
  )
}
