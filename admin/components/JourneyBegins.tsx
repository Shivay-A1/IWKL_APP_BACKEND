"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function JourneyBegins() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('journey-begins')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return (
    <section
      id="journey-begins"
      className={`py-10 px-4 sm:px-6 lg:px-8 transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Geometric background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#800080]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#800080]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="premium-card p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold gold-heading leading-tight">
                The Journey Begins
              </h2>
              <p className="text-lg text-[#F5F5F5] leading-relaxed">
                Indian Women's Kabaddi League (IWKL) is dedicated to creating opportunities, inspiring athletes, and elevating women's kabaddi to new heights. Every match, every team, and every player contributes to a growing legacy that empowers future generations.
              </p>
              <Link href="/about">
                <button className="premium-button inline-flex items-center px-8 py-3 text-white font-semibold">
                  Learn More
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <img
                  src="/images/img_mainpage.png"
                  alt="The Journey Begins"
                  className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                  style={{ maxHeight: '80%', maxWidth: '120%' }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#800080]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
