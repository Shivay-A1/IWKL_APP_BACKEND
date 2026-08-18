"use client"

import { Share2, Calendar, Facebook, Twitter, Instagram } from 'lucide-react'

export default function MatchHero() {
  return (
    <div className="relative bg-gradient-to-br from-[#800080] via-[#5B006E] to-[#2B123A] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/stadium-lights.png')] bg-cover bg-center opacity-10" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#800080]/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a0a2e]" />
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(45deg, #FFD700 25%, transparent 25%),
            linear-gradient(-45deg, #FFD700 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #FFD700 75%),
            linear-gradient(-45deg, transparent 75%, #FFD700 75%)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
        }} />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Side - Title */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-[#FFD700]/20 text-[#FFD700] rounded-full text-sm font-semibold border border-[#FFD700]/30">
                2026 SEASON
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              IWKL <span className="text-[#FFD700]">Match Center</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-6 max-w-2xl">
              Follow Live Scores, Upcoming Fixtures and Match Results
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 text-white/70">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Live Matches Available</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Season 2026</span>
              </div>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 border border-white/20 backdrop-blur-sm">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#800080] rounded-lg transition-all duration-300 font-semibold shadow-lg shadow-[#FFD700]/30">
              <Calendar className="w-5 h-5" />
              <span>Full Schedule</span>
            </button>
            <div className="flex items-center space-x-3">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
            <p className="text-3xl font-bold text-[#FFD700] mb-1">16</p>
            <p className="text-white/70 text-sm">Total Matches</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
            <p className="text-3xl font-bold text-[#FFD700] mb-1">8</p>
            <p className="text-white/70 text-sm">Teams</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
            <p className="text-3xl font-bold text-[#FFD700] mb-1">4</p>
            <p className="text-white/70 text-sm">Live Now</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
            <p className="text-3xl font-bold text-[#FFD700] mb-1">12</p>
            <p className="text-white/70 text-sm">Upcoming</p>
          </div>
        </div>
      </div>
    </div>
  )
}
