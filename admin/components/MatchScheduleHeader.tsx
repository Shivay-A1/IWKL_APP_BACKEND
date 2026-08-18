"use client"

import { Calendar, Instagram, Share2, Twitter, Copy, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MatchScheduleHeader() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 md:px-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Side - Heading */}
        <div className="flex-1">
          <h1 className="text-[42px] md:text-[52px] font-black text-white leading-tight mb-3">
            IWKL Match Schedule
          </h1>
          <p className="text-[13px] md:text-[14px] text-white opacity-80">
            All match timings are in IST. Schedule subject to change as per league regulations.
          </p>
        </div>

        {/* Right Side - Actions */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* Add To Calendar Button */}
          <button className="h-[52px] w-full md:w-[190px] bg-white text-[#800080] font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
            <Calendar className="w-5 h-5" />
            <span>Add to Calendar</span>
          </button>

          {/* Social Share Group */}
          <div className="h-[52px] w-full md:w-[360px] bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-around px-4 border border-white/20">
            <motion.a
              href="https://instagram.com/iwkl.official"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="https://x.com/theiwkl"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="https://youtube.com/channel/UCDr5W4o2fuZ4Frh05UMA9fg"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="https://wa.me/?text=Check%20out%20the%20IWKL%20Match%20Schedule!"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              <Copy className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
