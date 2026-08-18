"use client"

import { useState } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'

interface MatchFiltersProps {
  seasons: any[]
  teams: any[]
  selectedSeason: string
  selectedMonth: string
  selectedTeam: string
  selectedMatchType: string
  onSeasonChange: (value: string) => void
  onMonthChange: (value: string) => void
  onTeamChange: (value: string) => void
  onMatchTypeChange: (value: string) => void
  onReset: () => void
}

export default function MatchFilters({
  seasons,
  teams,
  selectedSeason,
  selectedMonth,
  selectedTeam,
  selectedMatchType,
  onSeasonChange,
  onMonthChange,
  onTeamChange,
  onMatchTypeChange,
  onReset,
}: MatchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const matchTypes = ['LEAGUE', 'PLAYOFF', 'SEMI_FINAL', 'FINAL']

  const hasActiveFilters = selectedSeason || selectedMonth || selectedTeam || selectedMatchType

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-[#FFD700]" />
          <span className="text-white font-semibold">Match Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded-full text-xs font-medium">
              Active
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-white/70 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Filter Options */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Season Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Season</label>
              <div className="relative">
                <select
                  value={selectedSeason}
                  onChange={(e) => onSeasonChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] appearance-none cursor-pointer hover:bg-white/15 transition-colors"
                >
                  <option value="">All Seasons</option>
                  {seasons.map((season: any) => (
                    <option key={season.id} value={season.id} className="bg-[#2B123A]">
                      {season.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
              </div>
            </div>

            {/* Month Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Month</label>
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => onMonthChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] appearance-none cursor-pointer hover:bg-white/15 transition-colors"
                >
                  <option value="">All Months</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-[#2B123A]">
                      {new Date(2026, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
              </div>
            </div>

            {/* Team Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Team</label>
              <div className="relative">
                <select
                  value={selectedTeam}
                  onChange={(e) => onTeamChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] appearance-none cursor-pointer hover:bg-white/15 transition-colors"
                >
                  <option value="">All Teams</option>
                  {teams.map((team: any) => (
                    <option key={team.id} value={team.id} className="bg-[#2B123A]">
                      {team.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
              </div>
            </div>

            {/* Match Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Match Type</label>
              <div className="relative">
                <select
                  value={selectedMatchType}
                  onChange={(e) => onMatchTypeChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] appearance-none cursor-pointer hover:bg-white/15 transition-colors"
                >
                  <option value="">All Types</option>
                  {matchTypes.map((type) => (
                    <option key={type} value={type} className="bg-[#2B123A]">
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <X className="w-4 h-4" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
