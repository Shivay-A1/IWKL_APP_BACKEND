"use client"

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function useScrollRestoration() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({})

  // Save scroll position before navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      scrollPositions[pathname] = window.scrollY
      sessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions))
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [pathname, scrollPositions])

  // Restore scroll position on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('scrollPositions')
    if (saved) {
      const positions = JSON.parse(saved)
      if (positions[pathname] !== undefined) {
        window.scrollTo(0, positions[pathname])
      }
    }
  }, [pathname])

  // Clear scroll position when query params change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [searchParams])
}
