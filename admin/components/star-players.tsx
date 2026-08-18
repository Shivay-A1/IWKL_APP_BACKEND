"use client"

import Link from 'next/link'
import { Award, TrendingUp, Target } from 'lucide-react'

interface Player {
  id: string
  name: string
  team: string
  position: string
  totalPoints: number
  raids: number
  tackles: number
  photoUrl: string
  teamLogo: string
}

interface StarPlayersProps {
  players?: Player[]
}

export default function StarPlayers({ players: propPlayers }: StarPlayersProps) {
  // Static data to prevent data loss
  const players = propPlayers || [
    {
      id: '1',
      name: 'Priya Sharma',
      team: 'Delhi Warriors',
      position: 'Raider',
      totalPoints: 156,
      raids: 89,
      tackles: 12,
      photoUrl: '/placeholder-player.jpg',
      teamLogo: '/team-logos/Delhi_warriors.jpeg'
    },
    {
      id: '2',
      name: 'Anjali Singh',
      team: 'Mumbai Strikers',
      position: 'Raider',
      totalPoints: 142,
      raids: 78,
      tackles: 8,
      photoUrl: '/placeholder-player.jpg',
      teamLogo: '/team-logos/mumbai_strkerrs.jpeg'
    },
    {
      id: '3',
      name: 'Kavita Nair',
      team: 'Ayodhya Shakti',
      position: 'Defender',
      totalPoints: 98,
      raids: 45,
      tackles: 53,
      photoUrl: '/placeholder-player.jpg',
      teamLogo: '/team-logos/Ayodhya_shakti.jpeg'
    },
    {
      id: '4',
      name: 'Sneha Patel',
      team: 'Garvi Gujarat',
      position: 'All-Rounder',
      totalPoints: 134,
      raids: 67,
      tackles: 34,
      photoUrl: '/placeholder-player.jpg',
      teamLogo: '/team-logos/Garvi_Gujarat.jpeg'
    },
    {
      id: '5',
      name: 'Riya Mehta',
      team: 'Kolkata Rangers',
      position: 'Raider',
      totalPoints: 128,
      raids: 72,
      tackles: 15,
      photoUrl: '/placeholder-player.jpg',
      teamLogo: '/team-logos/Kolkata_rengers.jpeg'
    },
    {
      id: '6',
      name: 'Divya Sharma',
      team: 'Haryanvi Fighters',
      position: 'Defender',
      totalPoints: 112,
      raids: 38,
      tackles: 47,
      photoUrl: '/placeholder-player.jpg',
      teamLogo: '/team-logos/Haryanvi_fighters.jpeg'
    }
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Star Players of Season 1
        </h2>
        <p className="text-[#F5F5F5]/80 text-lg">
          Meet the top performers lighting up the IWKL arena
        </p>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player, index) => (
          <Link
            key={player.id}
            href={`/players/${player.id}`}
            className="group"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2A003F] to-[#4F1B78] border border-[#BFA253]/30 hover:border-[#BFA253] transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2">
              {/* Player Photo */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A003F] via-transparent to-transparent z-10" />
                <div
                  className="w-full h-full bg-gradient-to-br from-[#4B0082] to-[#1A0033] flex items-center justify-center"
                >
                  <div className="w-32 h-32 rounded-full bg-[#BFA253]/20 flex items-center justify-center">
                    <span className="text-4xl font-bold text-[#BFA253]">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>

                {/* Rank Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="w-12 h-12 rounded-full bg-[#BFA253] flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-[#2A003F]">#{index + 1}</span>
                  </div>
                </div>

                {/* Team Logo */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-[#BFA253]/30">
                    <span className="text-xs font-bold text-[#BFA253]">
                      {player.team.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Player Info */}
              <div className="relative z-20 p-6">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#BFA253] transition-colors">
                  {player.name}
                </h3>
                <p className="text-sm text-[#BFA253] mb-4">{player.team}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award className="w-4 h-4 text-[#BFA253]" />
                    </div>
                    <p className="text-lg font-bold text-white">{player.totalPoints}</p>
                    <p className="text-xs text-[#F5F5F5]/60">Points</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-[#BFA253]" />
                    </div>
                    <p className="text-lg font-bold text-white">{player.raids}</p>
                    <p className="text-xs text-[#F5F5F5]/60">Raids</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="w-4 h-4 text-[#BFA253]" />
                    </div>
                    <p className="text-lg font-bold text-white">{player.tackles}</p>
                    <p className="text-xs text-[#F5F5F5]/60">Tackles</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <Link
          href="/players"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#BFA253] to-[#D4B865] text-[#2A003F] font-bold rounded-lg hover:from-[#D4B865] hover:to-[#E5C875] transition-all duration-300"
        >
          View All Players
        </Link>
      </div>
    </section>
  )
}
