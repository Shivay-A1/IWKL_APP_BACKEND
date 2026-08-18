"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Trophy, Users, Calendar, Target, Award, Star, Users as UsersIcon, Tv } from 'lucide-react'

export default function IWKLBanner() {
  return (
    <section className="relative w-full bg-[#1A0033] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0033] via-[#2A0A4A] to-[#1A0033]"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700] rounded-full filter blur-[128px] opacity-10 animate-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFD700] rounded-full filter blur-[128px] opacity-10 animate-glow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full">
        <div className="relative w-full h-[750px]">
          <Image
            src="/images/banner1.png"
            alt="IWKL Featured Banner"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
                {/* Left Side - Premium Statistics Strip */}
                <div className="animate-fade-in" style={{ marginLeft: '5px', marginBottom: '5px' }}>
                  {/* Horizontal Floating Strip - Premium Sports League Style */}
                  <div className="relative group transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/10 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-[#2A0A4A]/85 to-[#1A0033]/85 backdrop-blur-md border-t-2 border-[#FFD700]/60 rounded-2xl p-4 transition-all duration-300 group-hover:border-[#FFD700] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {/* Players */}
                        <div className="flex flex-col items-center">
                          <Users className="w-6 h-6 text-[#FFD700] mb-1" />
                          <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] leading-none">
                            120+
                          </div>
                          <div className="text-xs text-white/90 font-medium uppercase tracking-wide mt-1">Players</div>
                        </div>

                        {/* Teams */}
                        <div className="flex flex-col items-center">
                          <Trophy className="w-6 h-6 text-[#FFD700] mb-1" />
                          <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] leading-none">
                            8
                          </div>
                          <div className="text-xs text-white/90 font-medium uppercase tracking-wide mt-1">Teams</div>
                        </div>

                        {/* Matches */}
                        <div className="flex flex-col items-center">
                          <Target className="w-6 h-6 text-[#FFD700] mb-1" />
                          <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] leading-none">
                            32
                          </div>
                          <div className="text-xs text-white/90 font-medium uppercase tracking-wide mt-1">Matches</div>
                        </div>

                        {/* Thrilling Days */}
                        <div className="flex flex-col items-center">
                          <Calendar className="w-6 h-6 text-[#FFD700] mb-1" />
                          <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] leading-none">
                            16
                          </div>
                          <div className="text-xs text-white/90 font-medium uppercase tracking-wide mt-1">Thrilling Days</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Empty for banner image visibility */}
                <div className="hidden lg:block"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
