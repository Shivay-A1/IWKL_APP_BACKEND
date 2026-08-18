"use client"

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import apiService from '@/lib/api'

interface Banner {
  id: string
  imageUrl: string
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  displayOrder: number
  isActive: boolean
}

interface HeroSliderProps {
  banners?: Banner[]
}

const HeroSlider = memo(function HeroSlider({ banners: propBanners }: HeroSliderProps) {
  const [banners, setBanners] = useState<Banner[]>(propBanners || [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const topBanners = [
    { id: 'top-1', imageUrl: '/top-banner-1.png' },
    { id: 'top-2', imageUrl: '/top-banner-2.png' },
  ]

  useEffect(() => {
    setBanners(propBanners || [])
  }, [propBanners])

  useEffect(() => {
    const totalItems = banners.length > 0 ? banners.length : 2
    if (totalItems > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalItems)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [banners.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const totalItems = banners.length > 0 ? banners.length : 2
      return (prev - 1 + totalItems) % totalItems
    })
  }, [banners.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const totalItems = banners.length > 0 ? banners.length : 2
      return (prev + 1) % totalItems
    })
  }, [banners.length])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (diff > 50) {
      goToNext()
    } else if (diff < -50) {
      goToPrevious()
    }
  }, [touchStart, goToNext, goToPrevious])

  if (banners.length === 0) {
    return (
      <div
        ref={sliderRef}
        className="relative w-full aspect-[16/7] overflow-hidden bg-[#2b003f]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {topBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute top-0 left-0 right-0 bottom-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={banner.imageUrl}
              alt={`IWKL Top Banner ${index + 1}`}
              fill
              className="object-contain object-center"
              priority={index === currentIndex}
              sizes="100vw"
            />
          </div>
        ))}

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {topBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 hover:scale-125 transform ${
                index === currentIndex
                  ? 'bg-[#BFA253] w-5 md:w-6 shadow-[0_0_8px_rgba(191,162,83,0.5)]'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={sliderRef}
      className="relative w-full aspect-[16/7] overflow-hidden bg-[#2b003f]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute top-0 left-0 right-0 bottom-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative h-full">
            {/* Background Image */}
            <Image
              src={banner.imageUrl}
              alt={banner.title || 'Banner'}
              fill
              className="object-contain object-center"
              priority={index === currentIndex}
              sizes="100vw"
            />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full px-4 sm:px-6 max-w-[1400px] mx-auto">
                <div className="max-w-2xl">
                  {banner.title && (
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1.5 md:mb-2 lg:mb-3 leading-tight drop-shadow-lg">
                      {banner.title}
                    </h2>
                  )}
                  {banner.subtitle && (
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 mb-2 md:mb-3 lg:mb-4 drop-shadow-md">
                      {banner.subtitle}
                    </p>
                  )}
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {banner.ctaText && banner.ctaLink && (
                      <Link
                        href={banner.ctaLink}
                        className="inline-flex items-center gap-2 bg-[#BFA253] hover:bg-[#D4B865] text-[#2A003F] font-semibold px-3 py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5 rounded-lg transition-all duration-300 hover:scale-105 transform text-xs md:text-sm lg:text-base"
                      >
                        {banner.ctaText}
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/30 hover:bg-[#BFA253] backdrop-blur-sm border border-white/20 hover:border-[#BFA253] rounded-full flex items-center justify-center text-white hover:text-[#2A003F] transition-all duration-300 z-10"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/30 hover:bg-[#BFA253] backdrop-blur-sm border border-white/20 hover:border-[#BFA253] rounded-full flex items-center justify-center text-white hover:text-[#2A003F] transition-all duration-300 z-10"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 hover:scale-125 transform ${
                index === currentIndex
                  ? 'bg-[#BFA253] w-5 md:w-6 shadow-[0_0_8px_rgba(191,162,83,0.5)]'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
})

export default HeroSlider
