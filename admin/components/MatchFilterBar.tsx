"use client"

import { RotateCcw } from 'lucide-react'

interface MatchFilterBarProps {
  seasons: any[]
  teams: any[]
  selectedSeason: string
  selectedMonth: string
  selectedTeam: string
  onSeasonChange: (value: string) => void
  onMonthChange: (value: string) => void
  onTeamChange: (value: string) => void
  onReset: () => void
}

export default function MatchFilterBar({
  seasons,
  teams,
  selectedSeason,
  selectedMonth,
  selectedTeam,
  onSeasonChange,
  onMonthChange,
  onTeamChange,
  onReset,
}: MatchFilterBarProps) {
  return (
    <div className="h-auto md:h-[72px] bg-white rounded-lg shadow-md px-4 md:px-6 py-4 md:py-0 flex flex-col md:flex-row items-center gap-3 md:gap-4">
      {/* Season Filter */}
      <div className="flex-1 w-full">
        <select
          value={selectedSeason}
          onChange={(e) => onSeasonChange(e.target.value)}
          className="w-full h-[48px] md:h-full px-4 md:px-5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#800080] focus:ring-2 focus:ring-[#800080]/20 transition-all cursor-pointer font-semibold text-sm md:text-base"
        >
          <option value="">Season</option>
          {seasons.map((season: any) => (
            <option key={season.id} value={season.id}>{season.name}</option>
          ))}
        </select>
      </div>

      {/* Month Filter */}
      <div className="flex-1 w-full">
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="w-full h-[48px] md:h-full px-4 md:px-5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#800080] focus:ring-2 focus:ring-[#800080]/20 transition-all cursor-pointer font-semibold text-sm md:text-base"
        >
          <option value="">Month</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(2026, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      {/* Team Filter */}
      <div className="flex-1 w-full">
        <select
          value={selectedTeam}
          onChange={(e) => onTeamChange(e.target.value)}
          className="w-full h-[48px] md:h-full px-4 md:px-5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#800080] focus:ring-2 focus:ring-[#800080]/20 transition-all cursor-pointer font-semibold text-sm md:text-base"
        >
          <option value="">Team</option>
          {teams.map((team: any) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="h-[48px] md:h-[56px] px-5 md:px-7 bg-[#800080] text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-[#5B006E] transition-colors w-full md:w-auto justify-center"
      >
        <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
        <span className="text-sm md:text-base">Reset</span>
      </button>
    </div>
  )
}
