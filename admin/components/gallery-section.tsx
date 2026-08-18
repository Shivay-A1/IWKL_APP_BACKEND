"use client"

import { useEffect, useState, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Camera, Star, Image as ImageIcon, ChevronRight, ArrowRight } from 'lucide-react'
import { apiService } from '@/lib/api'
import { useData } from '@/lib/hooks'

interface GalleryItem {
  id: string
  title: string
  description?: string
  imageUrl?: string
  mediaUrl?: string
  category?: string
  album?: string
}

interface GallerySectionProps {
  gallery?: GalleryItem[]
  featuredImage?: string
}

const GallerySection = memo(function GallerySection({ gallery: propGallery, featuredImage }: GallerySectionProps) {
  const { data: galleryData, loading } = useData(() => apiService.gallery.getAll({ limit: 10 }), [], propGallery || [])
  const gallery = Array.isArray(galleryData) ? galleryData : []

  // Get backend URL from environment or default
  const getBackendUrl = () => {
    if (typeof window !== 'undefined') {
      return process.env.NEXT_PUBLIC_BACKEND_URL || 'https://iwkl-backend-lg6t-production.up.railway.app'
    }
    return 'https://iwkl-backend-lg6t-production.up.railway.app'
  }

  const backendUrl = getBackendUrl()

  // Function to get full image URL
  const getImageUrl = (url?: string) => {
    if (!url) return featuredImage || '/gallery-featured-image.png'
    // If it's already a full URL, return it
    if (url.startsWith('http')) return url
    // If it's a relative path starting with /uploads, prepend backend URL
    if (url.startsWith('/uploads')) {
      return `${backendUrl}${url}`
    }
    // Otherwise return as is
    return url
  }

  // Use featuredImage prop if provided, otherwise use default
  const displayFeaturedImage = featuredImage || '/gallery-featured-image.png'

  return (
    <section className="w-full bg-gradient-to-br from-[#1A0033] to-[#2A003F] px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-10 lg:py-12">
      {/* Section Header */}
      <div className="w-full max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          IWKL Gallery
        </h2>
        <Link
          href="/gallery"
          className="flex items-center text-[#FFD24A] text-sm md:text-base font-semibold hover:translate-x-1 transition-transform"
        >
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="w-full max-w-7xl mx-auto text-center py-10">
          <div className="inline-block w-10 h-10 border-4 border-[#FFD24A] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white mt-4">Loading gallery...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && gallery.length === 0 && (
        <div className="w-full max-w-7xl mx-auto text-center py-10">
          <Camera className="w-16 h-16 text-[#BFA253] mx-auto mb-4" />
          <p className="text-white">No gallery items available</p>
        </div>
      )}

      {/* Featured Gallery Section - Only shows if featuredImage prop is provided */}
      {!loading && featuredImage && (
        <div className="relative w-full mb-6 group">
          {/* Featured Image Container */}
          <div className="relative w-full overflow-hidden rounded-2xl mb-4 bg-[#2b003f]">
            <img
              src={displayFeaturedImage}
              alt="Featured Gallery"
              className="w-full h-auto object-cover object-center block"
              loading="lazy"
              decoding="async"
              style={{ imageRendering: 'crisp-edges' }}
              onError={(e) => {
                e.currentTarget.src = '/gallery-featured-image.png'
              }}
            />
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 md:px-8 lg:px-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#FFD24A] transition-colors">
              Featured Gallery
            </h3>

            {/* Meta Info */}
            <div className="flex items-center text-sm text-gray-400 mb-3">
              <ImageIcon className="w-4 h-4 mr-2" />
              <span>{gallery.length} Photos</span>
            </div>

            {/* View Gallery */}
            <Link href="/gallery" className="flex items-center text-[#FFD24A] text-base font-semibold group-hover:translate-x-1 transition-transform">
              View Gallery
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      )}

      {/* Gallery Horizontal Scroll - All items go here */}
      {!loading && gallery.length > 0 && (
        <div className="w-full max-w-7xl mx-auto">
          {/* Horizontal Scroll Row */}
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {gallery.map((item, index) => (
              <Link
                key={item.id}
                href="/gallery"
                className="flex-shrink-0 w-80 group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-[#4C085D]/30 transition-all duration-300 hover:-translate-y-2 bg-[#2A003F]"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  {item.mediaUrl ? (
                    <img
                      src={getImageUrl(item.mediaUrl)}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-[#2A0033] flex items-center justify-center ${item.mediaUrl ? 'hidden' : ''}`}>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#BFA253]/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#BFA253]/40 transition-colors">
                        <Camera className="w-8 h-8 text-[#BFA253]" />
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#FFD24A] transition-colors">{item.title}</h3>
                      {item.category && (
                        <p className="text-[#F5F5F5] text-sm">{item.category}</p>
                      )}
                    </div>
                  </div>
                  {/* Purple Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4C085D]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#2A003F]/90 to-transparent">
                  <h3 className="text-base md:text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-[#FFD24A] transition-colors">
                    {item.title}
                  </h3>

                  {/* Category Badge */}
                  {item.category && (
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Camera className="w-3 h-3" />
                      <span>{item.category}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
})

export default GallerySection