"use client"

import { useEffect, useState, useRef } from 'react'

export default function LeagueStats() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <div ref={sectionRef} className="py-16 bg-[#330033] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CC66FF] rounded-full filter blur-[128px] opacity-10 animate-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#CC66FF] rounded-full filter blur-[128px] opacity-10 animate-glow"></div>
        
        {/* Geometric Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-10 w-40 h-40 border-2 border-[#CC66FF] rotate-45"></div>
          <div className="absolute bottom-20 right-10 w-60 h-60 border-2 border-[#CC66FF] rotate-12"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border-2 border-[#CC66FF] -rotate-30"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
        </div>
      </div>
    </div>
  )
}
