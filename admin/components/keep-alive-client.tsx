'use client'

import { useEffect } from 'react'
import { startKeepAlive } from '@/lib/keep-alive'

export default function KeepAliveClient() {
  useEffect(() => {
    // Start keep-alive only in production
    if (process.env.NODE_ENV === 'production') {
      startKeepAlive()
    }
  }, [])

  return null // This component doesn't render anything
}
