"use client"

interface MatchTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  liveCount: number
  upcomingCount: number
  completedCount: number
}

export default function MatchTabs({
  activeTab,
  onTabChange,
  liveCount,
  upcomingCount,
  completedCount,
}: MatchTabsProps) {
  const tabs = [
    { id: 'live', label: 'LIVE', count: liveCount },
    { id: 'upcoming', label: 'UPCOMING', count: upcomingCount },
    { id: 'completed', label: 'COMPLETED', count: completedCount },
  ]

  return (
    <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-[#800080] to-[#5B006E] text-white shadow-lg shadow-[#800080]/30'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === tab.id
                    ? 'bg-[#FFD700] text-[#800080]'
                    : 'bg-white/20 text-white'
                }`}
              >
                {tab.count}
              </span>
            )}
            {tab.id === 'live' && activeTab === 'live' && (
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
