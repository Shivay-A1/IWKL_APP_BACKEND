"use client"

import { useRef, memo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import TeamCard from '@/components/team-card'

interface TeamsSliderProps {
  onTeamClick?: (team: any) => void
  teams?: any[]
}

const TeamsSlider = memo(function TeamsSlider({ onTeamClick, teams: propTeams }: TeamsSliderProps) {
  // Use prop teams if provided, otherwise show empty state
  const teams = propTeams && propTeams.length > 0 
    ? propTeams.map((team: any) => ({
        id: team.id,
        name: team.name,
        shortName: team.shortName,
        slug: team.slug || team.name.toLowerCase().replace(/\s+/g, '-'),
        logo: team.logo,
        city: team.city,
        matchesPlayed: team.matchesPlayed || 0,
        wins: team.wins || 0,
        points: team.points || 0,
        highestScore: team.highestScore || 0,
        primaryColor: team.primaryColor || team.jerseyColor || '#FF4500',
        secondaryColor: team.secondaryColor || '#FF6B35',
        accentColor: team.accentColor,
        gradient: team.gradient || `linear-gradient(135deg, ${team.primaryColor || team.jerseyColor || '#FF4500'} 0%, ${team.secondaryColor || '#FF6B35'} 50%, ${team.secondaryColor || '#FF8C42'} 100%)`,
      }))
    : []

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  const handleTeamClick = (team: any) => {
    if (onTeamClick) {
      onTeamClick(team)
    }
  }

  return (
    <>
      {/* Section Header - Professional Sports League Styling */}
      <div className="mb-4 text-center">
          {/* Gold Divider Line Above */}
          <div className="w-full max-w-2xl mx-auto mb-3" style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #BFA253, transparent)' }} />
          
          {/* Main Heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ 
            color: '#FFFFFF',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.02em',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            8 LEGENDS OF IWKL SEASON 1
          </h2>
          
          {/* Gold Divider Line Below */}
          <div className="w-full max-w-2xl mx-auto mb-4" style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #BFA253, transparent)' }} />
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-12">
            <div className="premium-card max-w-md mx-auto p-8">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-white mb-3">Teams Coming Soon</h3>
              <p className="text-[#F5F5F5]">
                The official IWKL teams will revealed soon. Stay tuned for exciting team announcements!
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 glass-card border border-[#BFA253]/30 rounded-full flex items-center justify-center text-[#BFA253] hover:bg-[#BFA253] hover:text-[#2A003F] transition-all duration-300 shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 glass-card border border-[#BFA253]/30 rounded-full flex items-center justify-center text-[#BFA253] hover:bg-[#BFA253] hover:text-[#2A003F] transition-all duration-300 shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slider Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {teams.map((team: any) => (
                <Link 
                  key={team.id} 
                  href={`/teams/${team.slug}`} 
                  prefetch={true}
                  className="flex-shrink-0 w-80" 
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <TeamCard team={team} />
                </Link>
              ))}
            </div>
          </div>
        )}
    </>
  )
})

export default TeamsSlider
