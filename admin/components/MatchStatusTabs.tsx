"use client"

import { motion } from 'framer-motion'

interface MatchStatusTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  liveCount: number
  upcomingCount: number
  recentCount: number
}

export default function MatchStatusTabs({
  activeTab,
  onTabChange,
  liveCount,
  upcomingCount,
  recentCount,
}: MatchStatusTabsProps) {
  const tabs = [
    { id: 'live', label: 'Live', count: liveCount },
    { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
    { id: 'recent', label: 'Completed', count: recentCount },
  ]

  return (
    <div className="flex justify-center mb-8 px-4">
      <div className="w-full max-w-[800px] h-[60px] bg-white rounded-lg shadow-md flex items-center p-1.5">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 h-full rounded-lg font-semibold text-base md:text-lg transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                : 'bg-[#800080] text-white hover:bg-[#5B006E]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20">
                  {tab.count}
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
