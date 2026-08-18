'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Play, Pause, Volume2, VolumeX, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  type: 'video' | 'image'
  src: string
  alt?: string
}

const slides: Slide[] = [
  { type: 'image', src: '/veera1.png', alt: 'Veera Image 1' },
  { type: 'image', src: '/veera2.png', alt: 'Veera Image 2' },
]

export default function MascotMediaShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  // Viewport intersection observer for pause/resume
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
          if (entry.isIntersecting && videoRef.current && currentSlide === 0) {
            // Video is visible, play it
            if (videoRef.current.paused) {
              videoRef.current.play()
              setIsPlaying(true)
            }
          } else if (!entry.isIntersecting && videoRef.current && !videoRef.current.paused) {
            // Video is not visible, pause it
            videoRef.current.pause()
            setIsPlaying(false)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [currentSlide])

  // Auto-play slide change every 3 seconds
  useEffect(() => {
    if (!isInteracting && isVisible && isPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 3000)
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isInteracting, isVisible, isPlaying])

  // Video progress update
  useEffect(() => {
    if (videoRef.current && currentSlide === 0) {
      progressRef.current = setInterval(() => {
        if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime)
        }
      }, 100)
    }
    
    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current)
      }
    }
  }, [currentSlide])

  // Video metadata loaded
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        if (videoRef.current) {
          setDuration(videoRef.current.duration)
        }
      })
    }
  }, [])

  // Show/hide controls on hover/touch
  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true)
    setShowControls(true)
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }, [])

  const handleInteractionEnd = useCallback(() => {
    setIsInteracting(false)
  }, [])

  // Video controls
  const togglePlay = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation()
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [])

  const toggleMute = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }, [])

  const toggleFullscreen = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation()
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(e.target.value)
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  // Navigation
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
    handleInteractionStart()
  }, [handleInteractionStart])

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    handleInteractionStart()
  }, [handleInteractionStart])

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    handleInteractionStart()
  }, [handleInteractionStart])

  // Touch swipe
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
    handleInteractionStart()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      goToNext()
    }
    if (touchEnd - touchStart > 50) {
      goToPrev()
    }
    handleInteractionEnd()
  }

  // Mouse drag
  const [dragStart, setDragStart] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart(e.clientX)
    setIsDragging(true)
    handleInteractionStart()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const diff = dragStart - e.clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext()
      else goToPrev()
      setIsDragging(false)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    handleInteractionEnd()
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === ' ') {
        e.preventDefault()
        if (currentSlide === 0) togglePlay()
      }
      if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide, isFullscreen, goToPrev, goToNext, togglePlay])

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 mb-4 sm:mb-5 md:mb-6 h-[160px] sm:h-[200px] md:h-[260px] lg:h-[300px] xl:h-[340px]"
      style={{
        background: '#140020',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-400 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              pointerEvents: index === currentSlide ? 'auto' : 'none',
            }}
          >
            {/* Blurred Background */}
            <div className="absolute inset-0">
              {slide.type === 'video' ? (
                <video
                  src={slide.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover blur-3xl opacity-50"
                />
              ) : (
                <Image
                  src={slide.src}
                  alt={slide.alt || `Slide ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover blur-3xl opacity-50"
                />
              )}
            </div>

            {/* Main Media */}
            <div className="absolute inset-0 flex items-center justify-center px-0">
              {slide.type === 'video' ? (
                <video
                  ref={index === 0 ? videoRef : undefined}
                  src={slide.src}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  className="max-w-full max-h-full object-contain"
                  onClick={toggleFullscreen}
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center" onClick={toggleFullscreen}>
                  <Image
                    src={slide.src}
                    alt={slide.alt || `Slide ${index + 1}`}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Overlay Controls */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-4 sm:p-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(to bottom, rgba(20,0,32,0.8) 0%, transparent 30%, transparent 70%, rgba(20,0,32,0.8) 100%)',
        }}
      >
        {/* Top Controls */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            {currentSlide === 0 && (
              <button
                onClick={(e) => togglePlay(e)}
                onTouchStart={(e) => togglePlay(e)}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                style={{ color: '#BFA253' }}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
            )}
            {currentSlide === 0 && (
              <button
                onClick={(e) => toggleMute(e)}
                onTouchStart={(e) => toggleMute(e)}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                style={{ color: '#BFA253' }}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            )}
          </div>
          <button
            onClick={(e) => toggleFullscreen(e)}
            onTouchStart={(e) => toggleFullscreen(e)}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            style={{ color: '#BFA253' }}
          >
            <Maximize2 size={20} />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-col gap-2">
          {/* Progress Bar (Video Only) */}
          {currentSlide === 0 && duration > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-white text-xs" style={{ color: '#BFA253' }}>
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #BFA253 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%)`,
                  appearance: 'none',
                  borderRadius: '4px',
                }}
              />
              <span className="text-white text-xs" style={{ color: '#BFA253' }}>
                {formatTime(duration)}
              </span>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-end">
            <button
              onClick={goToPrev}
              className="p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors hidden sm:block"
              style={{ color: '#BFA253' }}
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="w-3 h-3 rounded-full transition-all duration-300"
                  style={{
                    background: index === currentSlide ? '#BFA253' : 'rgba(255,255,255,0.5)',
                    transform: index === currentSlide ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors hidden sm:block"
              style={{ color: '#BFA253' }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
