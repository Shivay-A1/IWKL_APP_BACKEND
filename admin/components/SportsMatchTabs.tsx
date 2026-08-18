"use client"

interface SportsMatchTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  liveCount: number
  upcomingCount: number
  completedCount: number
}

export default function SportsMatchTabs({
  activeTab,
  onTabChange,
  liveCount,
  upcomingCount,
  completedCount,
}: SportsMatchTabsProps) {
  const tabs = [
    { id: 'live', label: 'LIVE', count: liveCount },
    { id: 'upcoming', label: 'UPCOMING', count: upcomingCount },
    { id: 'completed', label: 'COMPLETED', count: completedCount },
  ]

  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
            activeTab === tab.id
              ? 'bg-[#FFD700] text-[#800080] shadow-lg shadow-[#FFD700]/30'
              : 'bg-[#800080] text-white hover:bg-[#900090]'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-bold">
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
