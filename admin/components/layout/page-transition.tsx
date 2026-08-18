"use client"

import { useEffect, useState } from 'react'

interface PageTransitionProps {
  children: React.ReactNode
  isLoading?: boolean
}

export default function PageTransition({ children, isLoading = false }: PageTransitionProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a0033]">
        <div className="animate-pulse">
          <div className="h-20 bg-[#2A003F] border-b border-[#BFA253]/30" />
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            <div className="h-64 bg-[#2A003F]/50 rounded-2xl" />
            <div className="h-96 bg-[#2A003F]/50 rounded-2xl" />
            <div className="h-64 bg-[#2A003F]/50 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`transition-opacity duration-300 ${
        isMounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  )
}
