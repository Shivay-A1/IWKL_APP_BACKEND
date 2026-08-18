"use client"

import { MapPin, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import TeamLogo from '@/components/team-logo'
import { getTeamTheme } from '@/lib/team-theme'

interface ProfessionalMatchCardProps {
  match: any
  matchNumber: number
}

export default function ProfessionalMatchCard({ match, matchNumber }: ProfessionalMatchCardProps) {
  const router = useRouter()
  const isLive = match.status === 'LIVE'
  const isCompleted = match.status === 'COMPLETED'
  const isUpcoming = match.status === 'SCHEDULED'

  const homeScore = match.homeScore || match.result?.homeScore || 0
  const awayScore = match.awayScore || match.result?.awayScore || 0

  const homeTeamTheme = getTeamTheme(match.homeTeam?.name, match.homeTeam?.shortName)
  const awayTeamTheme = getTeamTheme(match.awayTeam?.name, match.awayTeam?.shortName)

  const handleCardClick = () => {
    router.push(`/matches/${match.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
      onClick={handleCardClick}
      className="h-auto md:h-[100px] w-full bg-white rounded-lg p-4 md:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex flex-col md:flex-row items-center h-full gap-3 md:gap-5">
        {/* Left Column - Match Number */}
        <div className="w-full md:w-[120px] flex-shrink-0 text-center md:text-left">
          <p className="text-xs md:text-sm font-semibold text-gray-600">Match {matchNumber}</p>
        </div>

        {/* Team 1 */}
        <div className="flex-1 flex items-center gap-2 md:gap-3 w-full justify-center md:justify-start">
          <div 
            className="w-9 h-9 md:w-11 md:h-11 rounded-lg flex items-center justify-center overflow-hidden border-2 flex-shrink-0"
            style={{ 
              backgroundColor: `${homeTeamTheme.primaryColor}20`,
              borderColor: homeTeamTheme.primaryColor
            }}
          >
            <TeamLogo 
              teamName={match.homeTeam?.name}
              teamShortName={match.homeTeam?.shortName}
              logo={match.homeTeam?.logo}
              size={44}
              alt={match.homeTeam?.name}
            />
          </div>
          <p className="font-semibold text-gray-900 text-sm md:text-base">{match.homeTeam?.name}</p>
        </div>

        {/* Score Area */}
        <div className="w-full md:w-[180px] flex-shrink-0 flex items-center justify-center">
          {isCompleted ? (
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xl md:text-2xl font-bold text-gray-900">{homeScore}</span>
              <div className="w-[36px] h-[36px] md:w-[44px] md:h-[44px] rounded-full border-4 border-green-500 flex items-center justify-center bg-white">
                <span className="text-green-600 font-bold text-xs md:text-sm">FT</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-900">{awayScore}</span>
            </div>
          ) : isUpcoming ? (
            <div className="text-center">
              <p className="text-lg md:text-xl font-bold text-[#FF6B00]">
                {new Date(match.matchDate).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xl md:text-2xl font-bold text-gray-900">{homeScore}</span>
              <div className="w-[36px] h-[36px] md:w-[44px] md:h-[44px] rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-xs">LIVE</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-900">{awayScore}</span>
            </div>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex-1 flex items-center gap-2 md:gap-3 w-full justify-center md:justify-start">
          <p className="font-semibold text-gray-900 text-sm md:text-base">{match.awayTeam?.name}</p>
          <div 
            className="w-9 h-9 md:w-11 md:h-11 rounded-lg flex items-center justify-center overflow-hidden border-2 flex-shrink-0"
            style={{ 
              backgroundColor: `${awayTeamTheme.primaryColor}20`,
              borderColor: awayTeamTheme.primaryColor
            }}
          >
            <TeamLogo 
              teamName={match.awayTeam?.name}
              teamShortName={match.awayTeam?.shortName}
              logo={match.awayTeam?.logo}
              size={44}
              alt={match.awayTeam?.name}
            />
          </div>
        </div>

        {/* Venue Column */}
        <div className="w-full md:w-[220px] flex-shrink-0 flex items-center gap-2 justify-center md:justify-start">
          <MapPin className="w-4 h-4 text-[#800080]" />
          <div className="text-xs md:text-sm text-center md:text-left">
            <p className="font-medium text-gray-900">{match.stadium?.name || match.venue}</p>
            {match.stadium?.city && (
              <p className="text-gray-600 text-xs">{match.stadium.city}</p>
            )}
          </div>
        </div>

        {/* Right Arrow */}
        <div className="w-full md:w-[45px] flex-shrink-0 flex items-center justify-center">
          <ArrowRight className="w-5 h-5 text-[#800080]" />
        </div>
      </div>
    </motion.div>
  )
}
