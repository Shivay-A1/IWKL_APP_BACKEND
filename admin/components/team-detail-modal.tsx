"use client"

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { X, MapPin, Users, Heart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface TeamDetailModalProps {
  team: any
  isOpen: boolean
  onClose: () => void
}

export default function TeamDetailModal({ team, isOpen, onClose }: TeamDetailModalProps) {
  if (!team) return null

  const teamColor = team.teamColor || '#800080'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-transparent border-none">
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Team Banner */}
          {team.banner ? (
            <div className="relative h-64 md:h-80">
              <img
                src={team.banner}
                alt={`${team.name} Banner`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
          ) : (
            <div 
              className="h-64 md:h-80"
              style={{ background: `linear-gradient(135deg, ${teamColor}60, ${teamColor}80)` }}
            />
          )}

          {/* Team Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-2xl flex-shrink-0">
                {team.logo ? (
                  <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <Users className="w-12 h-12 md:w-16 md:h-16" style={{ color: teamColor }} />
                )}
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{team.name}</h2>
                <p className="text-lg text-white/80 mb-3">{team.shortName}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/70">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{team.city || 'N/A'}</span>
                  </div>
                  {team.coach && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Coach: {team.coach}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8" style={{ background: 'linear-gradient(135deg, #2A0033, #4B0055, #800080)' }}>
          {/* Description */}
          {team.description && (
            <div className="mb-6">
              <p className="text-white/90 text-base leading-relaxed">{team.description}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/10 border-[#CC66FF]/30">
              <CardContent className="p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{team.matchesPlayed ?? 0}</p>
                <p className="text-[#D9D9D9] text-sm">Matches</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-[#CC66FF]/30">
              <CardContent className="p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{team.wins ?? 0}</p>
                <p className="text-[#D9D9D9] text-sm">Wins</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-[#CC66FF]/30">
              <CardContent className="p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{team.points ?? 0}</p>
                <p className="text-[#D9D9D9] text-sm">Points</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-[#CC66FF]/30">
              <CardContent className="p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{team.highestScore ?? 0}</p>
                <p className="text-[#D9D9D9] text-sm">High Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Players */}
          {team.players && team.players.length > 0 && (
            <Card className="bg-white/10 border-[#CC66FF]/30 mb-6">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-4 text-lg">Players</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {team.players.map((player: any) => (
                    <div key={player.id} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                        {player.image ? (
                          <img src={player.image} alt={player.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <Users className="w-8 h-8 text-white/50" />
                        )}
                      </div>
                      <p className="font-semibold text-xs text-white truncate">{player.name}</p>
                      <p className="text-xs text-[#D9D9D9]">#{player.jerseyNumber || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stadium Info */}
          {team.stadium && (
            <Card className="bg-white/10 border-[#CC66FF]/30">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-3 text-lg">Home Stadium</h3>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#FFD700]" />
                  <div>
                    <p className="text-white font-medium">{team.stadium.name}</p>
                    <p className="text-[#D9D9D9] text-sm">{team.stadium.city || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
