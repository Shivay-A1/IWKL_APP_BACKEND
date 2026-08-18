"use client"

import { useRef, useState, useEffect, memo } from 'react'
import Link from 'next/link'
import { Play, Eye, Calendar, ChevronRight, Star } from 'lucide-react'

interface Video {
  id: string
  title: string
  thumbnailUrl: string
  youtubeUrl: string
  description: string
  displayOrder: number
  isActive: boolean
  isFeatured: boolean
  duration?: number
  viewCount?: number
  publishedAt?: string
  category?: {
    id: string
    name: string
  }
}

const formatDuration = (seconds?: number) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatViewCount = (count?: number) => {
  if (!count) return '0'
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '31 Oct 2025'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

const PremiumVideoHub = memo(function PremiumVideoHub({ videos: propVideos }: { videos?: Video[] }) {
  const videos = propVideos || []
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get featured video (first one)
  const featuredVideos = videos.filter((v: Video) => v.isFeatured === true)
  const displayFeatured = featuredVideos.length > 0 
    ? featuredVideos.sort((a: Video, b: Video) => a.displayOrder - b.displayOrder)[0]
    : (videos.length > 0 ? videos[0] : null)

  // Get top picks (first 6)
  const topPicks = videos
    .sort((a: Video, b: Video) => a.displayOrder - b.displayOrder)
    .slice(0, 6)

  const getYouTubeThumbnail = (url: string) => {
    if (!url) return null
    const youtubeMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/)
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`
    }
    return null
  }

  const normalizeThumbnailUrl = (url: string | null | undefined) => {
    if (!url) return null
    if (url.includes('img.youtube.com')) {
      return url.replace('/maxresdefault.jpg', '/hqdefault.jpg').replace('/maxresdefault', '/hqdefault')
    }
    return url
  }

  const getThumbnail = (video: Video) => {
    return normalizeThumbnailUrl(video.thumbnailUrl) || getYouTubeThumbnail(video.youtubeUrl) || '/images/unplugged.png'
  }

  return (
    <div className="w-full">
      {/* FULL HERO CONTAINER */}
      <section className="relative w-full h-[380px] md:h-[460px] lg:h-[520px] xl:h-[560px] overflow-hidden mt-6 md:mt-7 lg:mt-8">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/unplugged.png"
            alt="IWKL Unplugged"
            className="w-full h-full object-cover"
          />
          {/* Dark Gradient Overlay (left to right) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B14]/50 via-[#0B0B14]/30 to-transparent" />
          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B14]/50 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 items-center">
              {/* LEFT CONTENT (40%) */}
              <div className="lg:col-span-5 space-y-3 md:space-y-4">
                {/* FEATURED Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFD24A] rounded-full">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-[#0B0B14]" />
                  <span className="text-xs md:text-sm font-bold text-[#0B0B14]">FEATURED</span>
                </div>

                {/* Main Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  {displayFeatured?.title || 'IWKL Unplugged'}
                </h1>

                {/* Episode Highlight */}
                {displayFeatured?.category && (
                  <div className="text-lg md:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD24A] to-[#FFA500]">
                    {displayFeatured.category.name}
                  </div>
                )}

                {/* Description */}
                <p className="text-sm md:text-base text-gray-300 max-w-lg line-clamp-2 md:line-clamp-3">
                  {displayFeatured?.description || 'Behind the scenes of IWKL teams preparing for the upcoming season.'}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-gray-400">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Eye className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{formatViewCount(displayFeatured?.viewCount)} Views</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{formatDate(displayFeatured?.publishedAt)}</span>
                  </div>
                </div>

                {/* Watch Now Button */}
                {displayFeatured && (
                  <Link href={`/videos/${displayFeatured.id}`}>
                    <button className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-[#FFD24A] to-[#FFA500] rounded-full font-bold text-[#0B0B14] text-sm md:text-base hover:shadow-[0_0_30px_rgba(255,210,74,0.5)] transition-all duration-300 hover:scale-105 mt-6">
                      Watch Now
                    </button>
                  </Link>
                )}
              </div>

              {/* RIGHT VIDEO AREA (60%) - Center Play Button */}
              <div className="lg:col-span-7 relative flex items-center justify-center lg:items-start lg:justify-start lg:pt-8" style={{ zIndex: '10' } as React.CSSProperties}>
                {/* Center Play Button */}
                {displayFeatured && (
                  <Link href={`/videos/${displayFeatured.id}`}>
                    <button className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-black/30 backdrop-blur-sm border-2 border-[#FFD24A] flex items-center justify-center hover:scale-110 transition-all duration-300 lg:static lg:top-auto lg:left-auto lg:transform-none md:mt-0" style={{ zIndex: '20' } as React.CSSProperties}>
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white ml-1" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP PICKS SECTION */}
      <section className="w-full bg-gradient-to-br from-[#1A0033] to-[#2A003F] px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-10 lg:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap' } as React.CSSProperties}>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white whitespace-nowrap">TOP PICKS</h2>
          <Link href="/videos" className="flex items-center gap-2 text-[#FFD24A] hover:text-[#FFA500] transition-colors font-semibold text-sm md:text-base whitespace-nowrap">
            View All Videos <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>

        {/* Video Cards Responsive Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
          {topPicks.map((video: Video) => {
            const thumbnailUrl = getThumbnail(video)
            return (
              <Link key={video.id} href={`/videos/${video.id}`} className="group cursor-pointer">
                <div className="h-full flex flex-col">
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800 group-hover:scale-105 transition-transform duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/30">
                    <img
                      src={thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        const fallback = '/images/unplugged.png'
                        if (target.src !== fallback) {
                          target.src = fallback
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 bg-[#FFD24A]/90 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-7 h-7 text-[#0B0B14] ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    {/* {video.duration && (
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        {formatDuration(video.duration)}
                      </div>
                    )} */}
                  </div>

                  {/* Video Info */}
                  <div className="mt-3 md:mt-4 flex-1 flex flex-col">
                    <h3 className="text-sm md:text-base font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#FFD24A] transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2 md:gap-3 text-xs text-gray-400 mt-auto">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{formatViewCount(video.viewCount)} Views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(video.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Video Player Modal */}
      {isModalOpen && displayFeatured && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-[#FFD24A] transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${displayFeatured.youtubeUrl.split('/').pop()}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  )
})

export default PremiumVideoHub
