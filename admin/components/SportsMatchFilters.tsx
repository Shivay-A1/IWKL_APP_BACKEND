"use client"

import { X } from 'lucide-react'

interface SportsMatchFiltersProps {
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

export default function SportsMatchFilters({
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
}: SportsMatchFiltersProps) {
  const matchTypes = ['LEAGUE', 'PLAYOFF', 'SEMI_FINAL', 'FINAL']

  const hasActiveFilters = selectedSeason || selectedMonth || selectedTeam || selectedMatchType

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Filter Matches</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
          >
            <X className="w-4 h-4" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Season Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Season</label>
          <select
            value={selectedSeason}
            onChange={(e) => onSeasonChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#800080] focus:ring-2 focus:ring-[#800080]/20 transition-all cursor-pointer"
          >
            <option value="">All Seasons</option>
            {seasons.map((season: any) => (
              <option key={season.id} value={season.id}>{season.name}</option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#800080] focus:ring-2 focus:ring-[#800080]/20 transition-all cursor-pointer"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2026, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        {/* Team Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Team</label>
          <select
            value={selectedTeam}
            onChange={(e) => onTeamChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#800080] focus:ring-2 focus:ring-[#800080]/20 transition-all cursor-pointer"
          >
            <option value="">All Teams</option>
            {teams.map((team: any) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>

        {/* Match Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Match Type</label>
          <select
            value={selectedMatchType}
            onChange={(e) => onMatchTypeChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#800080] focus:ring-2 focus:ring-[#800080]/20 transition-all cursor-pointer"
          >
            <option value="">All Types</option>
            {matchTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
