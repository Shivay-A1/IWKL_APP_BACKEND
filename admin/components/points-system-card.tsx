"use client"

import { memo } from 'react'
import { Trophy, Award, Medal, Star } from 'lucide-react'

const PointsSystemCard = memo(function PointsSystemCard() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4F1B78] to-[#2A003F] px-5 py-3">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 md:w-7 md:h-7 text-[#BFA253]" />
              IWKL POINTS SYSTEM
            </h2>
          </div>

          {/* Content */}
          <div className="p-4 md:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Section 1: Match Points */}
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-3 border border-purple-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-[#4F1B78]" />
                  <h3 className="text-base font-bold text-[#4F1B78]">MATCH POINTS</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white rounded-lg p-2 border border-gray-100">
                    <span className="text-gray-700 font-medium text-sm">Win</span>
                    <span className="text-xl font-bold text-green-600">2</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-lg p-2 border border-gray-100">
                    <span className="text-gray-700 font-medium text-sm">Loss</span>
                    <span className="text-xl font-bold text-red-600">0</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-lg p-2 border border-gray-100">
                    <span className="text-gray-700 font-medium text-sm">Tie / No Result</span>
                    <span className="text-xl font-bold text-gray-600">1</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Qualification Rules */}
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-3 border border-amber-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-[#BFA253]" />
                  <h3 className="text-base font-bold text-[#4F1B78]">QUALIFICATION RULES</h3>
                </div>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 border border-amber-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Medal className="w-3 h-3 text-[#BFA253]" />
                      <span className="font-bold text-[#4F1B78] text-sm">Top 4 Teams</span>
                    </div>
                    <p className="text-xs text-gray-600">Direct Qualification for Semi Finals</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-amber-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-3 h-3 text-gray-400" />
                      <span className="font-bold text-[#4F1B78] text-sm">Teams 5-8</span>
                    </div>
                    <p className="text-xs text-gray-600">Play-In Qualification</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Form Guide */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-3 border border-green-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-green-600" />
                  <h3 className="text-base font-bold text-[#4F1B78]">FORM GUIDE</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-100">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-700 font-medium text-sm">Win</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-100">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="text-gray-700 font-medium text-sm">No Result</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-100">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-700 font-medium text-sm">Loss</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Playoff Format */}
              <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-[#4F1B78]/5 to-[#BFA253]/5 rounded-xl p-3 border border-[#4F1B78]/20 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4 text-[#4F1B78]" />
                  <h3 className="text-base font-bold text-[#4F1B78]">PLAYOFF FORMAT</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-[#BFA253]/30">
                    <p className="text-gray-700 text-sm">
                      <span className="font-bold text-[#4F1B78]">Top 4 Teams</span> qualify directly for Semi Finals.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-[#BFA253]/30">
                    <p className="text-gray-700 text-sm">
                      Winning teams advance to the <span className="font-bold text-[#BFA253]">IWKL Final</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5: Season Info */}
              <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-[#4F1B78] to-[#2A003F] rounded-xl p-3 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-[#BFA253]" />
                  <h3 className="text-base font-bold text-white">SEASON INFO</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white/70 text-xs mb-1">Season</p>
                    <p className="text-white font-bold text-base">IWKL Season 1</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white/70 text-xs mb-1">Teams</p>
                    <p className="text-white font-bold text-base">8 Official IWKL Teams</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white/70 text-xs mb-1">Format</p>
                    <p className="text-white font-bold text-base">League + Semi Finals + Final</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default PointsSystemCard
