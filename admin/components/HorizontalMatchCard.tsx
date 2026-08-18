"use client"

import { MapPin, PlayCircle } from 'lucide-react'

interface HorizontalMatchCardProps {
  match: any
  isActive?: boolean
}

export default function HorizontalMatchCard({ match, isActive = false }: HorizontalMatchCardProps) {
  const isLive = match.status === 'LIVE'
  const isCompleted = match.status === 'COMPLETED'
  const isUpcoming = match.status === 'SCHEDULED'

  const homeScore = match.homeScore || match.result?.homeScore || 0
  const awayScore = match.awayScore || match.result?.awayScore || 0

  const matchType = match.matchType?.replace('_', ' ') || 'LEAGUE MATCH'

  return (
    <div className="bg-[#F4F4F4] rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center h-[110px]">
        {/* Section 1: Match Type */}
        <div className="w-[150px] flex-shrink-0 flex items-center justify-center border-r border-gray-300 px-4">
          <div className="text-center">
            <p className="font-semibold text-sm text-gray-800">{matchType}</p>
            {isLive && (
              <div className="flex items-center justify-center space-x-1 mt-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-500 font-bold text-xs">LIVE</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Center - Teams and Score */}
        <div className="flex-1 flex items-center justify-center border-r border-gray-300 px-6">
          <div className="flex items-center space-x-4">
            {/* Team A */}
            <div className="flex items-center space-x-3">
              <p className="font-medium text-sm text-gray-900">{match.homeTeam?.name}</p>
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                {match.homeTeam?.logo ? (
                  <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover" />
                ) : (
                  <PlayCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <span className="text-[40px] font-bold text-gray-900 leading-none">{homeScore}</span>
            </div>

            {/* FT/LIVE/VS Badge */}
            <div className="flex-shrink-0 mx-4">
              {isLive ? (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-red-500 border-3 border-red-300 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">LIVE</span>
                  </div>
                  <span className="text-gray-600 text-xs mt-1 font-medium">{match.matchTimer || '00:00'}</span>
                </div>
              ) : isCompleted ? (
                <div className="w-14 h-14 rounded-full bg-white border-3 border-green-500 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">FT</span>
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-white border-3 border-gray-400 flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">VS</span>
                </div>
              )}
            </div>

            {/* Team B */}
            <div className="flex items-center space-x-3">
              <span className="text-[40px] font-bold text-gray-900 leading-none">{awayScore}</span>
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                {match.awayTeam?.logo ? (
                  <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-cover" />
                ) : (
                  <PlayCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <p className="font-medium text-sm text-gray-900">{match.awayTeam?.name}</p>
            </div>
          </div>
        </div>

        {/* Section 3: Stadium */}
        <div className="w-[250px] flex-shrink-0 flex items-center border-r border-gray-300 px-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{match.stadium?.name || match.venue}</span>
          </div>
        </div>

        {/* Section 4: Arrow */}
        <div className="w-[50px] flex-shrink-0 flex items-center justify-center px-4">
          <span className="text-gray-600 text-xl">→</span>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Match Type Header */}
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
          <p className="font-semibold text-sm text-white">{matchType}</p>
          {isLive && (
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white font-bold text-xs">LIVE</span>
            </div>
          )}
        </div>

        {/* Teams and Score */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            {/* Home Team */}
            <div className="flex items-center space-x-2">
              <p className="font-medium text-sm text-gray-900">{match.homeTeam?.name}</p>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                {match.homeTeam?.logo ? (
                  <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover" />
                ) : (
                  <PlayCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <span className="text-2xl font-bold text-gray-900">{homeScore}</span>
            </div>

            {/* Score Badge */}
            {isLive ? (
              <div className="w-12 h-12 rounded-full bg-red-500 border-2 border-red-300 flex items-center justify-center">
                <span className="text-white font-bold text-xs">LIVE</span>
              </div>
            ) : isCompleted ? (
              <div className="w-12 h-12 rounded-full bg-white border-2 border-green-500 flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">FT</span>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center">
                <span className="text-gray-600 font-bold text-sm">VS</span>
              </div>
            )}

            {/* Away Team */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">{awayScore}</span>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                {match.awayTeam?.logo ? (
                  <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-cover" />
                ) : (
                  <PlayCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <p className="font-medium text-sm text-gray-900">{match.awayTeam?.name}</p>
            </div>
          </div>

          {/* Stadium */}
          <div className="flex items-center justify-between border-t border-gray-300 pt-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">{match.stadium?.name || match.venue}</span>
            </div>
            <span className="text-gray-600 text-lg">→</span>
          </div>
        </div>
      </div>

      {/* Live Score Details (only for live matches) */}
      {isLive && (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-gray-500 text-xs font-medium mb-1">RAID</p>
              <p className="text-gray-900 font-bold text-lg">{match.homeRaidPoints || 0} - {match.awayRaidPoints || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs font-medium mb-1">TACKLE</p>
              <p className="text-gray-900 font-bold text-lg">{match.homeTacklePoints || 0} - {match.awayTacklePoints || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs font-medium mb-1">BONUS</p>
              <p className="text-gray-900 font-bold text-lg">{match.homeBonusPoints || 0} - {match.awayBonusPoints || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs font-medium mb-1">ALL OUT</p>
              <p className="text-gray-900 font-bold text-lg">{match.homeAllOutCount || 0} - {match.awayAllOutCount || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
