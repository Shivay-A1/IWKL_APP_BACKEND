"use client"

import { useEffect, useState, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight } from 'lucide-react'
import { apiService } from '@/lib/api'
import { useData } from '@/lib/hooks'

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: string
  publishedAt: string
  category?: string
}

const FALLBACK_IMAGES = [
  '/iwkl-1.jpg',
  '/iwkl-2.jpg',
  '/iwkl-featured.png'
]

const getFallbackImage = (index: number) => {
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
}

interface LatestUpdatesProps {
  news?: NewsItem[]
  featuredImage?: string
}

const LatestUpdates = memo(function LatestUpdates({ news: propNews, featuredImage }: LatestUpdatesProps) {
  const { data: newsData, loading } = useData(() => apiService.news.getFeatured(), [], propNews || [])
  const news = Array.isArray(newsData) ? newsData : []

  const formatDate = (dateString: string) => {
    if (!dateString) return 'July 1, 2026'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'July 1, 2026'
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Get featured news (first one)
  const featuredNews = news.length > 0 ? news[0] : null
  const remainingNews = news.length > 1 ? news.slice(1) : []

  // Use featuredImage prop if provided, otherwise use featured news's own image
  const displayFeaturedImage = featuredImage || '/latest-featured-image.png'

  return (
    <section className="w-full bg-gradient-to-br from-[#1A0033] to-[#2A003F] px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-10 lg:py-12">
      {/* Section Header */}
      <div className="w-full max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          IWKL Latest Updates
        </h2>
        <Link
          href="/news"
          className="flex items-center text-[#FFD24A] text-sm md:text-base font-semibold hover:translate-x-1 transition-transform"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Featured News Section */}
      {featuredNews && (
        <div className="relative w-full mb-6 group">
          {/* Featured Image Container */}
          <div className="relative aspect-[16/7] overflow-hidden rounded-2xl mb-4 bg-[#2b003f]">
            <img
              src={displayFeaturedImage || getFallbackImage(0)}
              alt={featuredNews.title}
              className="w-full h-full object-contain object-center"
              loading="lazy"
              decoding="async"
              style={{ imageRendering: 'crisp-edges' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                if (target.src !== getFallbackImage(0)) {
                  target.src = getFallbackImage(0)
                }
              }}
            />
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 md:px-8 lg:px-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#FFD24A] transition-colors">
              {featuredNews.title}
            </h3>

            {/* Date */}
            <div className="flex items-center text-sm text-gray-400 mb-3">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(featuredNews.publishedAt)}
            </div>

            {/* Read More */}
            <Link href={`/news/${featuredNews.slug}`} className="flex items-center text-[#FFD24A] text-base font-semibold group-hover:translate-x-1 transition-transform">
              Read More
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      )}

      {/* Remaining News Horizontal Scroll */}
      {remainingNews.length > 0 && (
        <div className="w-full max-w-7xl mx-auto">
          {/* Horizontal Scroll Row */}
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {remainingNews.map((item, index) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="flex-shrink-0 w-80 group relative overflow-hidden rounded-[18px] shadow-xl hover:shadow-2xl hover:shadow-[#4C085D]/30 transition-all duration-300 hover:-translate-y-2 bg-[#2A003F]"
              >
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={index === 0 ? '/featured-2nd-news.png' : index === 1 ? '/featured-3rd-news.png' : '/latest-featured-image.png'}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Dark Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4C085D]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base md:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#FFD24A] transition-colors">
                    {item.title}
                  </h3>

                  {/* Date */}
                  <div className="flex items-center text-xs text-gray-400 mb-3">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(item.publishedAt)}
                  </div>

                  {/* Read More */}
                  <div className="flex items-center text-[#FFD24A] text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
})

export default LatestUpdates
