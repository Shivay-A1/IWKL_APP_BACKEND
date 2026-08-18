"use client"

import { MapPin, Calendar, Trophy, PlayCircle, ArrowRight } from 'lucide-react'

interface CompletedMatchCardProps {
  match: any
}

export default function CompletedMatchCard({ match }: CompletedMatchCardProps) {
  const result = match.result
  const winnerId = result?.winnerId
  const homeWon = winnerId === match.homeTeamId
  const awayWon = winnerId === match.awayTeamId

  const matchDate = new Date(match.matchDate)
  const formattedDate = matchDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:scale-[1.02]">
      {/* Completed Badge Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Trophy className="w-5 h-5 text-white" />
          <span className="text-white font-bold text-lg tracking-wide">COMPLETED</span>
          {match.matchType && (
            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold">
              {match.matchType.replace('_', ' ')}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 text-white/90">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">{formattedDate}</span>
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
          <div className={`text-center flex-1 ${homeWon ? 'opacity-100' : 'opacity-60'}`}>
            <div className={`w-20 h-20 mx-auto mb-3 rounded-2xl flex items-center justify-center overflow-hidden border-2 transition-all ${
              homeWon 
                ? 'border-[#FFD700] shadow-lg shadow-[#FFD700]/30' 
                : 'border-white/20'
            }`}>
              {match.homeTeam?.logo ? (
                <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover" />
              ) : (
                <PlayCircle className="w-10 h-10 text-white/50" />
              )}
            </div>
            <p className={`font-bold ${homeWon ? 'text-[#FFD700]' : 'text-white'}`}>{match.homeTeam?.name}</p>
            <p className="text-white/60 text-sm">{match.homeTeam?.shortName}</p>
            {homeWon && (
              <div className="mt-2 flex items-center justify-center space-x-1">
                <Trophy className="w-4 h-4 text-[#FFD700]" />
                <span className="text-[#FFD700] text-xs font-semibold">WINNER</span>
              </div>
            )}
          </div>

          {/* Score Display */}
          <div className="text-center px-6">
            <div className="text-5xl font-bold text-white mb-2">
              {result?.homeScore || match.homeScore} - {result?.awayScore || match.awayScore}
            </div>
            <div className="text-white/60 font-semibold text-sm">FINAL</div>
          </div>

          {/* Away Team */}
          <div className={`text-center flex-1 ${awayWon ? 'opacity-100' : 'opacity-60'}`}>
            <div className={`w-20 h-20 mx-auto mb-3 rounded-2xl flex items-center justify-center overflow-hidden border-2 transition-all ${
              awayWon 
                ? 'border-[#FFD700] shadow-lg shadow-[#FFD700]/30' 
                : 'border-white/20'
            }`}>
              {match.awayTeam?.logo ? (
                <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-cover" />
              ) : (
                <PlayCircle className="w-10 h-10 text-white/50" />
              )}
            </div>
            <p className={`font-bold ${awayWon ? 'text-[#FFD700]' : 'text-white'}`}>{match.awayTeam?.name}</p>
            <p className="text-white/60 text-sm">{match.awayTeam?.shortName}</p>
            {awayWon && (
              <div className="mt-2 flex items-center justify-center space-x-1">
                <Trophy className="w-4 h-4 text-[#FFD700]" />
                <span className="text-[#FFD700] text-xs font-semibold">WINNER</span>
              </div>
            )}
          </div>
        </div>

        {/* Match Summary */}
        {result?.manOfTheMatch && (
          <div className="bg-gradient-to-r from-[#800080]/20 to-[#5B006E]/20 rounded-xl p-4 mb-6 border border-[#800080]/30">
            <p className="text-center text-white/60 text-xs font-medium mb-2">MAN OF THE MATCH</p>
            <p className="text-center text-[#FFD700] font-bold text-lg">{result.manOfTheMatch}</p>
          </div>
        )}

        {/* Score Details */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-white/60 text-xs font-medium mb-1">RAID POINTS</p>
            <p className="text-2xl font-bold text-white">{match.homeRaidPoints || 0} - {match.awayRaidPoints || 0}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-white/60 text-xs font-medium mb-1">TACKLE POINTS</p>
            <p className="text-2xl font-bold text-white">{match.homeTacklePoints || 0} - {match.awayTacklePoints || 0}</p>
          </div>
        </div>
      </div>

      {/* Match Summary Button */}
      <div className="px-6 pb-6">
        <button className="w-full py-3 bg-gradient-to-r from-[#800080] to-[#5B006E] hover:from-[#900090] hover:to-[#6B007E] text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-[#800080]/30">
          <span>Match Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
