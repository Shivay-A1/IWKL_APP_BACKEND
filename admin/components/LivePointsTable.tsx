"use client"

import { Trophy, TrendingUp } from 'lucide-react'
import TeamLogo from '@/components/team-logo'
import { getTeamTheme } from '@/lib/team-theme'
import { normalizeTeamData } from '@/lib/TeamMaster'

interface LivePointsTableProps {
  pointsTable: any[]
}

export default function LivePointsTable({ pointsTable }: LivePointsTableProps) {
  // Normalize to filter out dummy teams - only keep official IWKL teams
  const normalizedPointsTable = normalizeTeamData(pointsTable)
  
  console.log('=== LivePointsTable Component ===')
  console.log('Raw pointsTable:', pointsTable)
  console.log('Normalized pointsTable:', normalizedPointsTable)
  
  if (!normalizedPointsTable || normalizedPointsTable.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-[#FFD700]" />
          <h2 className="text-3xl font-bold text-white">Live Points Table</h2>
        </div>
        <div className="flex items-center space-x-2 text-[#FFD700]">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Real-time Updates</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-xl">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-[#800080]/50 to-[#5B006E]/50 px-6 py-4 border-b border-white/10">
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-white/80 uppercase tracking-wider">
            <div className="col-span-1 text-center">Pos</div>
            <div className="col-span-3">Team</div>
            <div className="col-span-1 text-center">P</div>
            <div className="col-span-1 text-center">W</div>
            <div className="col-span-1 text-center">L</div>
            <div className="col-span-1 text-center">T</div>
            <div className="col-span-1 text-center">Raid</div>
            <div className="col-span-1 text-center">Tackle</div>
            <div className="col-span-2 text-center">Pts</div>
            <div className="col-span-1 text-center">Form</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-white/10">
          {normalizedPointsTable.map((entry: any, index: number) => {
            const position = entry.position || index + 1
            const isTop3 = position <= 3
            const isBottom3 = position >= pointsTable.length - 2
            const teamTheme = getTeamTheme(entry.team?.name, entry.team?.shortName)

            return (
              <div
                key={entry.id}
                className={`px-6 py-4 hover:bg-white/5 transition-colors ${
                  isTop3 ? 'bg-[#FFD700]/5' : isBottom3 ? 'bg-red-500/5' : ''
                }`}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Position */}
                  <div className="col-span-1 text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        isTop3
                          ? 'bg-[#FFD700] text-[#800080]'
                          : isBottom3
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {position}
                    </div>
                  </div>

                  {/* Team */}
                  <div className="col-span-3 flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden border-2"
                      style={{ 
                        backgroundColor: `${teamTheme.primaryColor}20`,
                        borderColor: teamTheme.primaryColor
                      }}
                    >
                      <TeamLogo 
                        teamName={entry.team?.name}
                        teamShortName={entry.team?.shortName}
                        logo={entry.team?.logo}
                        size={40}
                        alt={entry.team?.name}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{entry.team?.name}</p>
                    </div>
                  </div>

                  {/* Matches Played */}
                  <div className="col-span-1 text-center">
                    <span className="text-white/90 font-medium">{entry.matchesPlayed}</span>
                  </div>

                  {/* Wins */}
                  <div className="col-span-1 text-center">
                    <span className="text-green-400 font-semibold">{entry.wins}</span>
                  </div>

                  {/* Losses */}
                  <div className="col-span-1 text-center">
                    <span className="text-red-400 font-semibold">{entry.losses}</span>
                  </div>

                  {/* Ties */}
                  <div className="col-span-1 text-center">
                    <span className="text-white/90 font-medium">{entry.ties || 0}</span>
                  </div>

                  {/* Raid Points */}
                  <div className="col-span-1 text-center">
                    <span className="text-white/90 font-medium">{entry.raidPoints}</span>
                  </div>

                  {/* Tackle Points */}
                  <div className="col-span-1 text-center">
                    <span className="text-white/90 font-medium">{entry.tacklePoints}</span>
                  </div>

                  {/* Total Points */}
                  <div className="col-span-2 text-center">
                    <span className="text-2xl font-bold text-[#FFD700]">{entry.points}</span>
                  </div>

                  {/* Form Indicator */}
                  <div className="col-span-1 text-center">
                    <div className="flex justify-center space-x-1">
                      {entry.wins > 0 && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="Win" />
                      )}
                      {entry.losses > 0 && (
                        <div className="w-2 h-2 bg-red-500 rounded-full" title="Loss" />
                      )}
                      {entry.ties > 0 && (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Tie" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Table Footer */}
        <div className="bg-gradient-to-r from-[#800080]/20 to-[#5B006E]/20 px-6 py-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 text-white/70">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#FFD700] rounded-full" />
                <span>Top 3</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500/20 rounded-full border border-red-500/50" />
                <span>Bottom 3</span>
              </div>
            </div>
            <div className="text-white/60">
              Updated in real-time
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
