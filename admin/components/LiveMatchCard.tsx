"use client"

import { MapPin, Clock, ArrowRight, PlayCircle } from 'lucide-react'

interface LiveMatchCardProps {
  match: any
}

export default function LiveMatchCard({ match }: LiveMatchCardProps) {
  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-red-500/30 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:scale-[1.02]">
      {/* Live Badge Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-white font-bold text-lg tracking-wide">LIVE</span>
          </div>
          {match.matchType && (
            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold">
              {match.matchType.replace('_', ' ')}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 text-white/90">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{match.matchTimer || '00:00'}</span>
        </div>
      </div>

      {/* Match Content */}
      <div className="p-6">
        {/* Stadium Info */}
        <div className="flex items-center justify-center mb-6 text-white/70 text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{match.stadium?.name || match.venue}</span>
        </div>

        {/* Teams and Score */}
        <div className="flex items-center justify-between mb-6">
          {/* Home Team */}
          <div className="text-center flex-1">
            <div className="w-24 h-24 mx-auto mb-3 bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/20 hover:border-[#FFD700]/50 transition-colors">
              {match.homeTeam?.logo ? (
                <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover" />
              ) : (
                <PlayCircle className="w-12 h-12 text-white/50" />
              )}
            </div>
            <p className="font-bold text-white text-lg">{match.homeTeam?.name}</p>
            <p className="text-white/60 text-sm">{match.homeTeam?.shortName}</p>
          </div>

          {/* Score Display */}
          <div className="text-center px-6">
            <div className="text-5xl font-bold text-white mb-2">
              {match.homeScore} - {match.awayScore}
            </div>
            <div className="text-[#FFD700] font-semibold text-sm tracking-wider">VS</div>
          </div>

          {/* Away Team */}
          <div className="text-center flex-1">
            <div className="w-24 h-24 mx-auto mb-3 bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/20 hover:border-[#FFD700]/50 transition-colors">
              {match.awayTeam?.logo ? (
                <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-cover" />
              ) : (
                <PlayCircle className="w-12 h-12 text-white/50" />
              )}
            </div>
            <p className="font-bold text-white text-lg">{match.awayTeam?.name}</p>
            <p className="text-white/60 text-sm">{match.awayTeam?.shortName}</p>
          </div>
        </div>

        {/* Live Score Details */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-white/60 text-xs font-medium mb-1">RAID POINTS</p>
            <p className="text-2xl font-bold text-white">{match.homeRaidPoints || 0} - {match.awayRaidPoints || 0}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-white/60 text-xs font-medium mb-1">TACKLE POINTS</p>
            <p className="text-2xl font-bold text-white">{match.homeTacklePoints || 0} - {match.awayTacklePoints || 0}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-white/60 text-xs font-medium mb-1">BONUS POINTS</p>
            <p className="text-2xl font-bold text-white">{match.homeBonusPoints || 0} - {match.awayBonusPoints || 0}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-white/60 text-xs font-medium mb-1">ALL OUT</p>
            <p className="text-2xl font-bold text-white">{match.homeAllOutCount || 0} - {match.awayAllOutCount || 0}</p>
          </div>
        </div>

        {/* Match Timer Status */}
        <div className="bg-gradient-to-r from-[#800080]/20 to-[#5B006E]/20 rounded-xl p-4 text-center border border-[#800080]/30">
          <p className="text-[#FFD700] font-semibold text-sm">
            {match.halfTimeStatus || 'First Half'} • {match.matchTimer || '00:00'}
          </p>
        </div>
      </div>

      {/* Match Details Button */}
      <div className="px-6 pb-6">
        <button className="w-full py-3 bg-gradient-to-r from-[#800080] to-[#5B006E] hover:from-[#900090] hover:to-[#6B007E] text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-[#800080]/30">
          <span>Watch Live</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
