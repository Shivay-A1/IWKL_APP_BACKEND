"use client"

import HorizontalMatchCard from './HorizontalMatchCard'

interface MatchDateGroupProps {
  date: string
  matches: any[]
  isLiveTab?: boolean
}

export default function MatchDateGroup({ date, matches, isLiveTab = false }: MatchDateGroupProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="mb-12">
      {/* Date Header */}
      <div className="mb-6">
        <h3 className="text-[36px] font-bold text-[#3D0A4A]">{formatDate(date)}</h3>
      </div>

      {/* Match Cards */}
      <div className="space-y-4">
        {matches.map((match) => (
          <HorizontalMatchCard key={match.id} match={match} isActive={isLiveTab} />
        ))}
      </div>
    </div>
  )
}
