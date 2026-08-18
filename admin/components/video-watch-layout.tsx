"use client"

import { useState } from 'react'
import { Play, ChevronLeft, ChevronRight } from 'lucide-react'

interface Video {
  id: string
  title: string
  thumbnailUrl: string
  youtubeUrl: string
  description: string
  displayOrder: number
  isActive: boolean
  category?: {
    name: string
  }
}

interface VideoWatchLayoutProps {
  videos: Video[]
  initialVideoId?: string
  onClose?: () => void
}

export default function VideoWatchLayout({ videos, initialVideoId, onClose }: VideoWatchLayoutProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video>(
    videos.find((v) => v.id === initialVideoId) || videos[0]
  )

  const getEmbedUrl = (url: string) => {
    if (!url) return url
    
    const youtubeMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }
    
    return url
  }

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
    // If the URL is already a YouTube thumbnail URL, replace maxresdefault with hqdefault
    if (url.includes('img.youtube.com')) {
      return url.replace('/maxresdefault.jpg', '/hqdefault.jpg').replace('/maxresdefault', '/hqdefault')
    }
    return url
  }

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video)
  }

  const formatDate = (dateString?: string) => {
    return '14 June 2026'
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#1A0033] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#1A0033]/95 backdrop-blur-sm border-b border-[#CC66FF]/20 z-10 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-white">Video Watch</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-[#FFD700] transition-colors text-2xl font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Left Side - Video Player (60%) */}
        <div className="w-full lg:w-3/5">
          {/* Video Player */}
          <div className="relative aspect-video bg-[#330033] rounded-2xl overflow-hidden border border-[#CC66FF]/20 shadow-2xl mb-6">
            {selectedVideo.youtubeUrl ? (
              <iframe
                src={getEmbedUrl(selectedVideo.youtubeUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4A004A] to-[#330033]">
                <div className="text-center">
                  <Play className="w-16 h-16 text-[#CC66FF] mx-auto mb-4" />
                  <p className="text-white">Video not available</p>
                </div>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="bg-gradient-to-br from-[#2A0033] to-[#1A0033] rounded-2xl p-6 border border-[#CC66FF]/20">
            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              {selectedVideo.title}
            </h1>

            {/* Category Badge */}
            {selectedVideo.category && (
              <div className="mb-4">
                <span className="px-3 py-1 bg-[#FFD700]/20 text-[#FFD700] text-sm font-semibold rounded-full">
                  {selectedVideo.category.name}
                </span>
              </div>
            )}

            {/* Description */}
            <p className="text-[#D9D9D9] text-base leading-relaxed mb-4">
              {selectedVideo.description}
            </p>

            {/* Upload Date */}
            <div className="text-sm text-[#D9D9D9]">
              <span className="text-[#CC66FF]">Uploaded:</span> {formatDate(selectedVideo.displayOrder.toString())}
            </div>
          </div>
        </div>

        {/* Right Side - Playlist (40%) */}
        <div className="w-full lg:w-2/5">
          <div className="bg-gradient-to-br from-[#2A0033] to-[#1A0033] rounded-2xl border border-[#CC66FF]/20 overflow-hidden">
            {/* Playlist Header */}
            <div className="p-4 border-b border-[#CC66FF]/20">
              <h3 className="text-lg font-bold text-white">Playlist</h3>
              <p className="text-sm text-[#D9D9D9]">{videos.length} videos</p>
            </div>

            {/* Playlist Items */}
            <div className="h-[600px] overflow-y-auto scrollbar-hide">
              {videos.map((video) => {
                const thumbnailUrl = normalizeThumbnailUrl(video.thumbnailUrl) || getYouTubeThumbnail(video.youtubeUrl)
                const isActive = video.id === selectedVideo.id

                return (
                  <div
                    key={video.id}
                    onClick={() => handleVideoClick(video)}
                    className={`flex gap-3 p-4 cursor-pointer transition-all duration-300 border-b border-[#CC66FF]/10 ${
                      isActive
                        ? 'bg-[#4A004A]/50 border-l-4 border-l-[#FFD700]'
                        : 'hover:bg-[#4A004A]/30'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-32 aspect-video bg-[#330033] rounded-lg overflow-hidden">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#4B0082] to-[#1A0033]" />
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-semibold mb-1 line-clamp-2 ${
                        isActive ? 'text-[#FFD700]' : 'text-white'
                      }`}>
                        {video.title}
                      </h4>
                      {video.category && (
                        <p className="text-xs text-[#CC66FF] mb-1">
                          {video.category.name}
                        </p>
                      )}
                      <p className="text-xs text-[#D9D9D9] line-clamp-2">
                        {video.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
