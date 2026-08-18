"use client"

import { useData } from '@/lib/hooks'
import { apiService } from '@/lib/api'
import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react'
import TeamLogo from '@/components/team-logo'
import { getTeamTheme } from '@/lib/team-theme'

interface Team {
  id: string
  rank: number
  logo: string
  name: string
  shortName?: string
  played: number
  wins: number
  losses: number
  draws: number
  points: number
  scoreDifference: number
  highestScore: number
  recentForm: string
  positionChange: 'up' | 'down' | 'same'
}

export default function PointsTable() {
  const { data: teamsData, loading } = useData(() => apiService.points.getTable())
  const teams = (teamsData as any[]) || []

  console.log('=== PointsTable Component ===')
  console.log('Loading:', loading)
  console.log('TeamsData:', teamsData)
  console.log('Teams length:', teams.length)
  console.log('Teams:', teams)

  return (
    <div>
      <div className="bg-yellow-400 p-4 text-center text-black font-bold text-2xl">
        POINTS TABLE COMPONENT RENDERED - Loading: {loading ? 'YES' : 'NO'} - Teams: {teams.length}
      </div>

      {loading && (
        <section className="relative w-full bg-[#1A0033] py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-white text-xl">Loading standings...</div>
          </div>
        </section>
      )}

      {!loading && teams.length === 0 && (
        <section className="relative w-full bg-[#1A0033] overflow-hidden py-16 px-4">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A0033] via-[#2A0A4A] to-[#1A0033]"></div>
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700] rounded-full filter blur-[128px] opacity-10 animate-glow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFD700] rounded-full filter blur-[128px] opacity-10 animate-glow" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] mb-4 uppercase tracking-wider"
                  style={{ textShadow: '0 0 30px rgba(255, 215, 0, 0.4)' }}>
                IWKL League Points Table
              </h2>
              <div className="w-32 h-1 bg-[#FFD700] mx-auto rounded-full"
                   style={{ boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}></div>
            </div>

            {/* Empty State */}
            <div className="text-center py-12">
              <p className="text-[#D9D9D9] text-xl">Points table will be available once the season begins. Stay tuned for exciting IWKL action!</p>
            </div>
          </div>
        </section>
      )}

      {!loading && teams.length > 0 && (
        <>
          <div className="bg-green-400 p-4 text-center text-black font-bold text-2xl">
            RENDERING TABLE WITH {teams.length} TEAMS
          </div>

          <section className="relative w-full bg-[#1A0033] overflow-hidden py-16 px-4">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A0033] via-[#2A0A4A] to-[#1A0033]"></div>
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700] rounded-full filter blur-[128px] opacity-10 animate-glow"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFD700] rounded-full filter blur-[128px] opacity-10 animate-glow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
              {/* Section Title */}
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] mb-4 uppercase tracking-wider"
                    style={{ textShadow: '0 0 30px rgba(255, 215, 0, 0.4)' }}>
                  IWKL League Points Table
                </h2>
                <div className="w-32 h-1 bg-[#FFD700] mx-auto rounded-full"
                     style={{ boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}></div>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block animate-slide-up">
                <div className="glass-card rounded-2xl overflow-hidden"
                     style={{ border: '2px solid rgba(255, 215, 0, 0.3)', boxShadow: '0 0 40px rgba(255, 215, 0, 0.2)' }}>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#2A0A4A]/50">
                        <th className="px-6 py-4 text-left text-[#FFD700] font-bold uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-4 text-left text-[#FFD700] font-bold uppercase tracking-wider">Team</th>
                        <th className="px-6 py-4 text-center text-[#FFD700] font-bold uppercase tracking-wider">Played</th>
                        <th className="px-6 py-4 text-center text-[#FFD700] font-bold uppercase tracking-wider">Wins</th>
                        <th className="px-6 py-4 text-center text-[#FFD700] font-bold uppercase tracking-wider">Losses</th>
                        <th className="px-6 py-4 text-center text-[#FFD700] font-bold uppercase tracking-wider">Draws</th>
                        <th className="px-6 py-4 text-center text-[#FFD700] font-bold uppercase tracking-wider">Highest Score</th>
                        <th className="px-6 py-4 text-center text-[#FFD700] font-bold uppercase tracking-wider">Points</th>
                        <th className="px-6 py-4 text-center text-[#FFD700] font-bold uppercase tracking-wider">Score Diff</th>
                        <th className="px-6 py-4 text-center text-[#FFD700] font-bold uppercase tracking-wider">Form</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.map((team: Team, index: number) => {
                  const teamTheme = getTeamTheme(team.name, team.shortName)
                  return (
                    <tr
                      key={team.id}
                      className={`transition-all duration-300 hover:bg-[#FFD700]/10 ${
                        index < 4 ? 'bg-[#FFD700]/5' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-black ${
                            index < 4 ? 'text-[#FFD700]' : 'text-white'
                          }`}
                                style={{ textShadow: index < 4 ? '0 0 15px rgba(255, 215, 0, 0.5)' : '' }}>
                            {team.rank}
                          </span>
                          {index < 4 && (
                            <Trophy className="w-5 h-5 text-[#FFD700]" style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }} />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden border-2"
                            style={{ 
                              backgroundColor: `${teamTheme.primaryColor}20`,
                              borderColor: teamTheme.primaryColor
                            }}
                          >
                            <TeamLogo 
                              teamName={team.name}
                              teamShortName={team.shortName}
                              logo={team.logo}
                              size={48}
                              alt={team.name}
                            />
                          </div>
                          <span className="font-bold text-white">{team.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-white font-medium">{team.played}</td>
                      <td className="px-6 py-4 text-center text-white font-medium">{team.wins}</td>
                      <td className="px-6 py-4 text-center text-white font-medium">{team.losses}</td>
                      <td className="px-6 py-4 text-center text-white font-medium">{team.draws}</td>
                      <td className="px-6 py-4 text-center text-white font-medium">{team.highestScore || 0}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-2xl font-black ${
                          index < 4 ? 'text-[#FFD700]' : 'text-white'
                        }`}
                              style={{ textShadow: index < 4 ? '0 0 15px rgba(255, 215, 0, 0.5)' : '' }}>
                          {team.points}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-white font-medium">{team.scoreDifference}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-1">
                          {team.recentForm ? team.recentForm.split('').map((form, i) => (
                            <span
                              key={i}
                              className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                form === 'W' ? 'bg-green-500 text-white' :
                                form === 'L' ? 'bg-red-500 text-white' :
                                'bg-gray-500 text-white'
                              }`}
                            >
                              {form}
                            </span>
                          )) : '-'}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-4 animate-slide-up">
          {teams.map((team: Team, index: number) => {
            const teamTheme = getTeamTheme(team.name, team.shortName)
            return (
              <div
                key={team.id}
                className={`glass-card rounded-xl p-4 transition-all duration-300 hover:scale-105 ${
                  index < 4 ? 'bg-[#FFD700]/10' : ''
                }`}
                style={{
                  border: index < 4 ? '2px solid rgba(255, 215, 0, 0.5)' : '2px solid rgba(255, 215, 0, 0.2)',
                  boxShadow: index < 4 ? '0 0 30px rgba(255, 215, 0, 0.3)' : '0 0 20px rgba(255, 215, 0, 0.2)'
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-3xl font-black ${
                      index < 4 ? 'text-[#FFD700]' : 'text-white'
                    }`}
                          style={{ textShadow: index < 4 ? '0 0 15px rgba(255, 215, 0, 0.5)' : '' }}>
                      {team.rank}
                    </span>
                    {index < 4 && (
                      <Trophy className="w-6 h-6 text-[#FFD700]" style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }} />
                    )}
                  </div>
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden border-2"
                    style={{ 
                      backgroundColor: `${teamTheme.primaryColor}20`,
                      borderColor: teamTheme.primaryColor
                    }}
                  >
                    <TeamLogo 
                      teamName={team.name}
                      teamShortName={team.shortName}
                      logo={team.logo}
                      size={64}
                      alt={team.name}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{team.name}</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div className="bg-[#2A0A4A]/50 rounded-lg p-2">
                    <div className="text-[#D9D9D9] text-xs uppercase mb-1">Played</div>
                    <div className="text-white font-bold text-lg">{team.played}</div>
                  </div>
                  <div className="bg-[#2A0A4A]/50 rounded-lg p-2">
                    <div className="text-[#D9D9D9] text-xs uppercase mb-1">Wins</div>
                    <div className="text-white font-bold text-lg">{team.wins}</div>
                  </div>
                  <div className="bg-[#2A0A4A]/50 rounded-lg p-2">
                    <div className="text-[#D9D9D9] text-xs uppercase mb-1">Losses</div>
                    <div className="text-white font-bold text-lg">{team.losses}</div>
                  </div>
                  <div className="bg-[#2A0A4A]/50 rounded-lg p-2">
                    <div className="text-[#D9D9D9] text-xs uppercase mb-1">High</div>
                    <div className="text-white font-bold text-lg">{team.highestScore || 0}</div>
                  </div>
                  <div className="bg-[#2A0A4A]/50 rounded-lg p-2">
                    <div className="text-[#D9D9D9] text-xs uppercase mb-1">Points</div>
                    <div className={`font-black text-xl ${
                      index < 4 ? 'text-[#FFD700]' : 'text-white'
                    }`}
                          style={{ textShadow: index < 4 ? '0 0 15px rgba(255, 215, 0, 0.5)' : '' }}>
                      {team.points}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="text-[#D9D9D9] text-xs uppercase">Form:</div>
                  <div className="flex gap-1">
                    {team.recentForm ? team.recentForm.split('').map((form, i) => (
                      <span
                        key={i}
                        className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                          form === 'W' ? 'bg-green-500 text-white' :
                          form === 'L' ? 'bg-red-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}
                      >
                        {form}
                      </span>
                    )) : '-'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
        </>
      )}
    </div>
  )
}
