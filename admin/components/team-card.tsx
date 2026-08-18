"use client"

import { memo } from 'react'
import { Card } from '@/components/ui/card'
import TeamLogo from '@/components/team-logo'

interface TeamCardProps {
  team: {
    id: string
    name: string
    shortName: string
    logo?: string
    banner?: string
    description?: string
    teamColor?: string
    city?: string
    matchesPlayed?: number
    wins?: number
    points?: number
    highestScore?: number
  }
  onClick?: () => void
}

const TeamCard = memo(function TeamCard({ team, onClick }: TeamCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:translate-y-[-6px]"
      style={{ 
        background: 'rgba(42, 0, 63, 0.8)',
        backdropFilter: 'blur(10px)',
        borderWidth: '1px',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}
      onClick={onClick}
    >
      {/* Gold Accent Line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#BFA253] to-transparent"></div>

      {/* Top Section - Logo and Name */}
      <div className="relative p-6 text-center">
        {/* Premium Logo Container */}
        <div 
          className="mx-auto mb-4 flex items-center justify-center overflow-hidden backdrop-blur-sm"
          style={{ 
            width: '140px',
            height: '140px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '12px'
          }}
        >
          <TeamLogo 
            teamName={team.name}
            teamShortName={team.shortName}
            logo={team.logo}
            size={116}
            alt={team.name}
          />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{team.name.replace(/ Team$/, '')}</h3>
      </div>

      {/* Gold Accent Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#BFA253]/50 to-transparent mx-4"></div>

      {/* Bottom Section - Stats */}
      {team.matchesPlayed !== undefined && team.wins !== undefined && team.points !== undefined && (
        <div className="p-4 bg-black/20">
          <div className="flex justify-between text-center">
            <div style={{ width: '20%', margin: '0 12px' }}>
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Matches</p>
              <p className="text-lg font-bold text-white">{team.matchesPlayed}</p>
            </div>
            <div style={{ width: '20%', margin: '0 12px' }}>
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Wins</p>
              <p className="text-lg font-bold text-[#BFA253]">{team.wins}</p>
            </div>
            <div style={{ width: '20%', margin: '0 12px' }}>
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Pts</p>
              <p className="text-lg font-bold text-[#BFA253]">{team.points}</p>
            </div>
            <div style={{ width: '20%', margin: '0 12px' }}>
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">High</p>
              <p className="text-lg font-bold text-[#BFA253]">{team.highestScore || 0}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
})

export default TeamCard
