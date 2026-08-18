"use client"

import { Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

interface MatchDateHeaderProps {
  date: string
}

export default function MatchDateHeader({ date }: MatchDateHeaderProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-10 mb-6"
    >
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-[#4b0055]" />
        <h2 className="text-[36px] font-bold text-[#4b0055]">
          {formatDate(date)}
        </h2>
      </div>
    </motion.div>
  )
}
