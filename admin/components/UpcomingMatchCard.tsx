"use client"

import { useState, useEffect } from 'react'
import { MapPin, Calendar, Clock, PlayCircle, Bell } from 'lucide-react'

interface UpcomingMatchCardProps {
  match: any
}

export default function UpcomingMatchCard({ match }: UpcomingMatchCardProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const matchDate = new Date(match.matchDate)
      const now = new Date()
      const difference = matchDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [match.matchDate])

  const matchDate = new Date(match.matchDate)
  const formattedDate = matchDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })
  const formattedTime = matchDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:scale-[1.02]">
      {/* Match Type Header */}
      <div className="bg-gradient-to-r from-[#800080]/50 to-[#5B006E]/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {match.matchType && (
            <span className="px-3 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded-full text-xs font-semibold border border-[#FFD700]/30">
              {match.matchType.replace('_', ' ')}
            </span>
          )}
          <span className="text-white/80 text-sm font-medium">UPCOMING</span>
        </div>
        <button className="p-2 text-white/60 hover:text-[#FFD700] transition-colors">
          <Bell className="w-4 h-4" />
        </button>
      </div>

      {/* Match Content */}
      <div className="p-6">
        {/* Date and Time */}
        <div className="flex items-center justify-center mb-6 space-x-4 text-white/70 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between mb-6">
          {/* Home Team */}
          <div className="text-center flex-1">
            <div className="w-20 h-20 mx-auto mb-3 bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/20 hover:border-[#FFD700]/50 transition-colors">
              {match.homeTeam?.logo ? (
                <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover" />
              ) : (
                <PlayCircle className="w-10 h-10 text-white/50" />
              )}
            </div>
            <p className="font-bold text-white">{match.homeTeam?.name}</p>
            <p className="text-white/60 text-sm">{match.homeTeam?.shortName}</p>
          </div>

          {/* VS */}
          <div className="text-center px-4">
            <div className="text-3xl font-bold text-[#FFD700]">VS</div>
          </div>

          {/* Away Team */}
          <div className="text-center flex-1">
            <div className="w-20 h-20 mx-auto mb-3 bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/20 hover:border-[#FFD700]/50 transition-colors">
              {match.awayTeam?.logo ? (
                <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-cover" />
              ) : (
                <PlayCircle className="w-10 h-10 text-white/50" />
              )}
            </div>
            <p className="font-bold text-white">{match.awayTeam?.name}</p>
            <p className="text-white/60 text-sm">{match.awayTeam?.shortName}</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-[#800080]/20 to-[#5B006E]/20 rounded-xl p-4 mb-6 border border-[#800080]/30">
          <p className="text-center text-white/60 text-xs font-medium mb-3">MATCH STARTS IN</p>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <div className="bg-[#800080]/30 rounded-lg p-3 mb-1">
                <span className="text-2xl font-bold text-white">{timeLeft.days}</span>
              </div>
              <span className="text-white/60 text-xs">Days</span>
            </div>
            <div className="text-center">
              <div className="bg-[#800080]/30 rounded-lg p-3 mb-1">
                <span className="text-2xl font-bold text-white">{timeLeft.hours}</span>
              </div>
              <span className="text-white/60 text-xs">Hours</span>
            </div>
            <div className="text-center">
              <div className="bg-[#800080]/30 rounded-lg p-3 mb-1">
                <span className="text-2xl font-bold text-white">{timeLeft.minutes}</span>
              </div>
              <span className="text-white/60 text-xs">Mins</span>
            </div>
            <div className="text-center">
              <div className="bg-[#800080]/30 rounded-lg p-3 mb-1">
                <span className="text-2xl font-bold text-white">{timeLeft.seconds}</span>
              </div>
              <span className="text-white/60 text-xs">Secs</span>
            </div>
          </div>
        </div>

        {/* Stadium */}
        <div className="flex items-center justify-center text-white/70 text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{match.stadium?.name || match.venue}</span>
        </div>
      </div>

      {/* Set Reminder Button */}
      <div className="px-6 pb-6">
        <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 border border-white/20 flex items-center justify-center space-x-2">
          <Bell className="w-4 h-4" />
          <span>Set Reminder</span>
        </button>
      </div>
    </div>
  )
}
