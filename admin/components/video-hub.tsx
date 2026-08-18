"use client"

import { useRef } from 'react'
import Link from 'next/link'
import { Play, Clock, Eye, Calendar } from 'lucide-react'

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
  tags?: string[]
  category?: {
    name: string
  }
}

interface VideoHubProps {
  videos?: Video[]
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
  if (!dateStr) return 'Recently'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function VideoHub({ videos: propVideos }: VideoHubProps) {
  const videos = propVideos || []
  const carouselRef = useRef<HTMLDivElement>(null)

  // Get featured video (first one by displayOrder)
  // If no featured video, get first video
  const featuredVideos = videos.filter((v: Video) => v.isFeatured === true)
  const featuredVideo = featuredVideos
    .sort((a: Video, b: Video) => a.displayOrder - b.displayOrder)[0]

  // Fallback: use first video if no featured
  const fallbackFeatured = !featuredVideo && videos.length > 0
    ? videos.sort((a: Video, b: Video) => a.displayOrder - b.displayOrder)[0]
    : featuredVideo

  const displayFeatured = featuredVideo || fallbackFeatured

  // Get top picks (exclude featured, first 4)
  const topPicks = videos
    .filter((v: Video) => v.id !== displayFeatured?.id)
    .sort((a: Video, b: Video) => a.displayOrder - b.displayOrder)
    .slice(0, 4)

  const normalizeThumbnailUrl = (url: string | null | undefined) => {
    if (!url) return null
    // If the URL is already a YouTube thumbnail URL, replace maxresdefault with hqdefault
    if (url.includes('img.youtube.com')) {
      return url.replace('/maxresdefault.jpg', '/hqdefault.jpg').replace('/maxresdefault', '/hqdefault')
    }
    return url
  }

  const getYouTubeThumbnail = (url: string) => {
    if (!url) return null
    const youtubeMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/)
    if (youtubeMatch) {
      // Use hqdefault instead of maxresdefault (maxresdefault often doesn't exist for shorts)
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`
    }
    // If the URL is already a YouTube thumbnail URL, replace maxresdefault with hqdefault
    if (url.includes('img.youtube.com')) {
      return url.replace('/maxresdefault.jpg', '/hqdefault.jpg').replace('/maxresdefault', '/hqdefault')
    }
    return null
  }

  // Handle horizontal scroll with mouse wheel
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (carouselRef.current) {
      const delta = e.deltaY
      carouselRef.current.scrollLeft += delta
    }
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          IWKL League Video Hub
        </h2>
        <p className="text-sm text-[#F5F5F5]">
          Watch exciting match highlights, player interviews, and exclusive IWKL content.
        </p>
      </div>

      {/* Featured Hero Video Section */}
      {displayFeatured && (
        <div className="mb-6">
          <Link href={`/videos/${displayFeatured.id}`}>
            <div className="relative overflow-hidden rounded-3xl cursor-pointer group" style={{ height: '280px' }}>
              {/* Background Image */}
              <img
                src={normalizeThumbnailUrl(displayFeatured.thumbnailUrl) || getYouTubeThumbnail(displayFeatured.youtubeUrl) || '/placeholder-video.jpg'}
                alt={displayFeatured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A003F] via-[#4F1B78]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2A003F]/90 via-transparent to-transparent" />
              
              {/* Featured Badge */}
              <div className="absolute top-6 left-6">
                <div className="bg-[#BFA253] text-[#2A003F] px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  FEATURED
                </div>
              </div>
              
              {/* Duration Badge */}
              {displayFeatured.duration && (
                <div className="absolute top-6 right-6 bg-black/80 text-white text-sm px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  {formatDuration(displayFeatured.duration)}
                </div>
              )}
              
              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-[#BFA253] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[#D4B865] shadow-2xl">
                  <Play className="w-12 h-12 text-[#1A003F] ml-1" />
                </div>
              </div>
              
              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                {displayFeatured.category && (
                  <span className="inline-block px-3 py-1 bg-[#BFA253]/20 text-[#BFA253] text-xs font-semibold rounded-full mb-3 backdrop-blur-sm">
                    {displayFeatured.category.name}
                  </span>
                )}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight max-w-2xl">
                  {displayFeatured.title}
                </h3>
                <p className="text-sm text-[#F5F5F5]/90 mb-4 line-clamp-2 max-w-xl">
                  {displayFeatured.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-[#F5F5F5]/70">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatViewCount(displayFeatured.viewCount)} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(displayFeatured.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Top Picks Row (4 Videos Max) - Horizontal Carousel */}
      {topPicks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white">Top Picks</h3>
            <Link href="/videos" className="text-xs text-[#BFA253] hover:text-[#D4B865] transition-colors font-semibold">
              View All →
            </Link>
          </div>

          <div 
            ref={carouselRef}
            onWheel={handleWheel}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            } as React.CSSProperties}
          >
            {topPicks.map((video: Video) => {
              const thumbnailUrl = normalizeThumbnailUrl(video.thumbnailUrl) || getYouTubeThumbnail(video.youtubeUrl)
              return (
                <Link key={video.id} href={`/videos/${video.id}`} className="group cursor-pointer flex-shrink-0 w-72 snap-start">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800 group-hover:scale-[1.03] transition-transform duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/30 group-hover:border-2 group-hover:border-[#BFA253]/50">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          const fallback = getYouTubeThumbnail(video.youtubeUrl || '')
                          if (fallback && target.src !== fallback) {
                            target.src = fallback
                          }
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#4B0082] to-[#1A0033]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-[#BFA253]/90 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-[#1A003F] ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                        {formatDuration(video.duration)}
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="mt-3">
                    <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#BFA253] transition-colors">
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-[#F5F5F5]/50">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{formatViewCount(video.viewCount)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(video.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
